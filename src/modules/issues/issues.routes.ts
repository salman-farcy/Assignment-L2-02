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
router.get('/:id',  issuesController.getIssueUsingById)


export const issuesRouter = router;