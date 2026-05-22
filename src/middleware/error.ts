import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";


export const errorHandler = (
     error: Error,
     req: Request,
     res: Response,
     next: NextFunction
) => {
     console.error('❌ Error:', error.message);

     if (error.message.includes('ValidationError')) {
          sendError(res, 400, "Validation error", error.message);
          return;
     }

     if (error.message.includes('NotFoundError')) {
          sendError(res, 404, 'Resource not found', error.message);
          return;
     }

     if(error.message.includes('ConflictError')){
          sendError(res, 490, 'Conflict error', error.message);
          return;
     }

     // default error response
     sendError(res, 500, "Internal server error", error.message)
};


export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, `Route ${req.method} ${req.path} not found`);
};

