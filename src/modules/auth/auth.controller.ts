import type { Request, Response } from "express"
import type { SignupRequest } from "./auth.interface"
import { authService } from "./auth.service";
import { sendError, sendSuccess } from "../../utils/response";


const signUp = async (req: Request, res: Response) => {
     try {
          // const {name, email, password, role} = req.body as SignupRequest;

          const user = await authService.signUpServiceIntoDB(req.body);

          sendSuccess(res, 201, 'User registered successfully', user)
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';

          if (errorMessage.includes('ValidationError')) {
               const message = errorMessage.replace('ValidationError: ', '');
               sendError(res, 400, message);
          } else if (errorMessage.includes('Email already registered')) {
               sendError(res, 400, 'Email already registered');
          } else {
               sendError(res, 500, 'Internal server error', errorMessage);
          }
     }
}




export const authController = {
     signUp,
     login

}