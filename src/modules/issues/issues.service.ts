import { pool } from "../../db/schema";
import { isValidDescription, isValidStatus, isValidTitle, isValidType } from "../../utils/validation";
import type { CreateIssueRequest } from "./issues.interface";



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







export const issuesServices = {
     createIssueServiceDB,
     getAllIssuesServiceDB,

}