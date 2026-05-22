import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response";
import type { CreateIssueRequest } from "./issues.interface";
import { issuesServices } from "./issues.service";




const createIssue = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               sendError(res, 401, 'Authentication required');
               return;
          }

          const { title, description, type } = req.body as CreateIssueRequest;

          const issue = await issuesServices.createIssueServiceDB(
               {
                    title,
                    description,
                    type,
               },
               req.user.id
          );

          sendSuccess(res, 201, 'Issue created successfully', issue);
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Create issue failed';

          if (errorMessage.includes('ValidationError')) {
               const message = errorMessage.replace('ValidationError: ', '');
               sendError(res, 400, message);
          } else {
               sendError(res, 500, 'Internal server error', errorMessage);
          }
     }
};


const getAllIssues = async (req: Request, res: Response) => {
     try {
          const sortParam = typeof req.query.sort === 'string' ? req.query.sort : undefined;
          const sort = sortParam?.toLowerCase() === 'oldest' ? 'oldest' : 'newest';

          const typeParam = typeof req.query.type === 'string' ? req.query.type : undefined;
          const type = typeParam as 'bug' | 'feature_request' | undefined;

          const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;
          const status = statusParam as 'open' | 'in_progress' | 'resolved' | undefined;

          const issues = await issuesServices.getAllIssuesServiceDB(sort, type, status);

          sendSuccess(res, 200, 'Issues retrieved successfully', issues);
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Get all issues failed';
          sendError(res, 500, 'Internal server error', errorMessage);
     }
}


const getIssueUsingById = async (req: Request, res: Response) => {
     try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const issueId = parseInt(idParam as string, 10);

    if (isNaN(issueId)) {
      sendError(res, 400, 'Invalid issue ID');
      return;
    }

    const issue = await issuesServices.getIssueByIdServiceDB(issueId);

    sendSuccess(res, 200, 'Issue retrieved successfully', issue);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Get issue failed';

    if (errorMessage.includes('NotFoundError')) {
      sendError(res, 404, 'Issue not found');
    } else {
      sendError(res, 500, 'Internal server error', errorMessage);
    }
  }
}


const updateIssue = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const issueId = parseInt(idParam as string, 10);

    if (isNaN(issueId)) {
      sendError(res, 400, 'Invalid issue ID');
      return;
    }

    const { title, description, type, status } = req.body;

    const updatedIssue = await issuesServices.updateIssueServiceDB(
      issueId,
      { title, description, type, status },
      req.user.id,
      req.user.role
    );

    sendSuccess(res, 200, 'Issue updated successfully', updatedIssue);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Update issue failed';

    if (errorMessage.includes('ValidationError')) {
      const message = errorMessage.replace('ValidationError: ', '');
      sendError(res, 400, message);
    } else if (errorMessage.includes('NotFoundError')) {
      sendError(res, 404, 'Issue not found');
    } else if (errorMessage.includes('Forbidden')) {
      sendError(res, 403, errorMessage);
    } else if (errorMessage.includes('ConflictError')) {
      const message = errorMessage.replace('ConflictError: ', '');
      sendError(res, 409, message);
    } else {
      sendError(res, 500, 'Internal server error', errorMessage);
    }
  }
};


export const issuesController = {
     createIssue,
     getAllIssues,
     getIssueUsingById,
     updateIssue
}