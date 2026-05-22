import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";
import { verifyToken } from "../utils/jwt";



export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      sendError(res, 401, 'Missing Authorization header');
      return;
    } 
    
    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      sendError(res, 401, 'Invalid Authorization header format');
      return;
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      sendError(res, 401, 'Invalid or expired token');
      return;
    }

    // Attach user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    sendError(res, 401, 'Authentication failed');
  }
};