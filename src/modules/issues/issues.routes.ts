import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authMiddleware } from "../../middleware/auth";



const router = Router()

// POST  /api/issues
// Create a new issue (authenticated users)
router.post('/',authMiddleware, issuesController.createIssue);

    
// GET  /api/issues
// Get all issues (public)
router.get('/', issuesController.getAllIssues);


// GET /api/issues/:id
// Get a single issue by ID (public)
router.get('/:id',  issuesController.getIssueUsingById);


// PATCH /api/issues/:id
// Update an issue (authenticated users)
router.patch('/:id', authMiddleware, issuesController.updateIssue);


// DELETE /api/issues/:id
// Delete an issue (maintainers only)
router.delete('/:id', authMiddleware, issuesController.deleteIssue);


export const issuesRouter = router;