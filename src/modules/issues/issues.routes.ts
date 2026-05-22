import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authMiddleware } from "../../middleware/auth";



const router = Router()

// POST  /api/issues
// Create a new issue (authenticated users)
router.post('/',authMiddleware, issuesController.createIssue);


//GET  /api/issues
// Get all issues (public)
router.get('/', issuesController.getAllIssues);



router.get('/', )


export const issuesRouter = router;