import type { Response } from 'express';


interface SuccessResponse {
  success: true;
  message?: string;
  data?: unknown;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}


export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): Response => {
  const response: SuccessResponse = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};


export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  return res.status(statusCode).json({response});
};