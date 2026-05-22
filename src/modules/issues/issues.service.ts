import { pool } from "../../db/schema";
import { isValidDescription, isValidTitle, isValidType } from "../../utils/validation";
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
const getAllIssuesServiceDB = async () => {

}



export const issuesServices = {
     createIssueServiceDB,
     getAllIssuesServiceDB,

}