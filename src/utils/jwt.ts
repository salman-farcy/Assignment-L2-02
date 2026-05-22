import jwt from 'jsonwebtoken';
import config from '../config';

export interface JWTPayload {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

// generate JWT toke with user payload
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.secret as string, {
    expiresIn: config.expiry,
//     algorithm: 'HS256',
  } as any);
};


// verify jwt token and return decoded payload 
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.secret as string) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};