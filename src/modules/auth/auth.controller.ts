import type { Request, Response } from "express"
import type { LoginRequest, SignupRequest } from "./auth.interface"
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

const login = async (req: Request, res: Response) => {
     try {
          const { email, password } = req.body as LoginRequest;

          const response = await authService.loginUserServiceIntoDB({
               email,
               password,
          });

          const { accessToken, refreshToken, user} = response;
          res.cookie("refreshToken", refreshToken, {
               secure: false,
               httpOnly: true, 
               sameSite: 'lax'
          })

          sendSuccess(res, 200, 'Login successful', response);
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';

          if (errorMessage.includes('ValidationError')) {
               const message = errorMessage.replace('ValidationError: ', '');
               sendError(res, 400, message);
          } else if (errorMessage.includes('Invalid email or password')) {
               sendError(res, 400, 'Invalid email or password');
          } else {
               sendError(res, 500, 'Internal server error', errorMessage);
          }
     }
}


export const authController = {
     signUp,
     login

}