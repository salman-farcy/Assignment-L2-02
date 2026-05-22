import { pool } from "../../db/schema";
import { isValidDescription, isValidStatus, isValidTitle, isValidType } from "../../utils/validation";
import type { CreateIssueRequest, UpdateIssueRequest } from "./issues.interface";



//Create a new issues db
const createIssueServiceDB = async (
  data: CreateIssueRequest,
  reporterId: number
) => {
  // Validate input
  if (!isValidTitle(data.title)) {
    throw new Error('ValidationError: Title is required and must be max 150 characters');
  }

  if (!isValidDescription(data.description)) {
    throw new Error('ValidationError: Description must be at least 20 characters');
  }

  if (!isValidType(data.type)) {
    throw new Error('ValidationError: Type must be bug or feature_request');
  }

  try {
    const result = await pool.query(
      `INSERT INTO issues (title, description, type, reporter_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
      [data.title, data.description, data.type, reporterId]
    );

    const issue = result.rows[0];

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter_id: issue.reporter_id,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  } catch (error) {
    throw error;
  }
};



// get all issues in db
const getAllIssuesServiceDB = async (
  sort: 'newest' | 'oldest' = 'newest',
  type?: 'bug' | 'feature_request',
  status?: 'open' | 'in_progress' | 'resolved'
) => {

  try {
    let query = 'SELECT * FROM issues WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    // Apply type filter
    if (type && isValidType(type)) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Apply status filter
    if (status && isValidStatus(status)) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Apply sorting
    query += sort === 'oldest' ? ' ORDER BY created_at ASC' : ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    const issues = result.rows;

    // Fetch reporter details for each issue (no JOINs allowed)
    const issuesWithReporters = await Promise.all(
      issues.map(async (issue) => {
        const reporterResult = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [
          issue.reporter_id,
        ]);

        const reporter = reporterResult.rows[0];

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          type: issue.type,
          status: issue.status,
          reporter: reporter ? { id: reporter.id, name: reporter.name, role: reporter.role } : undefined,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
        };
      })
    );

    return issuesWithReporters;
  } catch (error) {
    console.error('Get all issues error:', error);
    throw error;
  }

}



// Get a single issue by ID
const getIssueByIdServiceDB = async (issueId: number) => {
  try {
    const result = await pool.query('SELECT * FROM issues WHERE id = $1', [issueId]);

    if (result.rows.length === 0) {
      throw new Error('NotFoundError: Issue not found');
    }

    const issue = result.rows[0];

    // Fetch reporter details
    const reporterResult = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [
      issue.reporter_id,
    ]);

    const reporter = reporterResult.rows[0];

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporter ? { id: reporter.id, name: reporter.name, role: reporter.role } : undefined,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  } catch (error) {
    throw error;
  }
}



// Update an issue
// Rules:
// - Maintainer can update any issue
// - Contributor can only update own issue if status is 'open'
const updateIssueServiceDB = async (
  issueId: number,
  data: UpdateIssueRequest,
  userId: number,
  userRole: 'contributor' | 'maintainer'
) => {

  try {
    // Fetch the issue
    const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [issueId]);

    if (issueResult.rows.length === 0) {
      throw new Error('NotFoundError: Issue not found');
    }

    const issue = issueResult.rows[0];

    // Check permissions
    if (userRole === 'contributor') {
      // Contributor can only update own issue
      if (issue.reporter_id !== userId) {
        throw new Error('Forbidden: You can only update your own issues');
      }

      // Contributor can only update if status is 'open'
      if (issue.status !== 'open') {
        throw new Error('ConflictError: Contributors can only update issues with open status');
      }
    }
    // Maintainer can update any issue (no restrictions)

    // Validate fields if provided
    if (data.title !== undefined && !isValidTitle(data.title)) {
      throw new Error('ValidationError: Title is required and must be max 150 characters');
    }

    if (data.description !== undefined && !isValidDescription(data.description)) {
      throw new Error('ValidationError: Description must be at least 20 characters');
    }

    if (data.type !== undefined && !isValidType(data.type)) {
      throw new Error('ValidationError: Type must be bug or feature_request');
    }

    if (data.status !== undefined && !isValidStatus(data.status)) {
      throw new Error('ValidationError: Status must be open, in_progress, or resolved');
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }

    if (data.type !== undefined) {
      updates.push(`type = $${paramIndex}`);
      values.push(data.type);
      paramIndex++;
    }

    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(data.status);
      paramIndex++;
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      // Only updated_at was set, no actual updates
      throw new Error('ValidationError: No valid fields to update');
    }

    values.push(issueId);

    const query = `
      UPDATE issues
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `;

    const updateResult = await pool.query(query, values);
    const updatedIssue = updateResult.rows[0];

    return {
      id: updatedIssue.id,
      title: updatedIssue.title,
      description: updatedIssue.description,
      type: updatedIssue.type,
      status: updatedIssue.status,
      reporter_id: updatedIssue.reporter_id,
      created_at: updatedIssue.created_at,
      updated_at: updatedIssue.updated_at,
    };
  } catch (error) {
    console.error('Update issue error:', error);
    throw error;
  }

}



export const issuesServices = {
     createIssueServiceDB,
     getAllIssuesServiceDB,
     getIssueByIdServiceDB,
     updateIssueServiceDB,

}