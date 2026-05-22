import jwt from 'jsonwebtoken';
import config from '../config';

export interface JWTPayload {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

// generate JWT Accesstoke with user payload
export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.acces_secret as string, {
    expiresIn: config.acces_expiry,
//     algorithm: 'HS256',
  } as any);
};

// generate refressToken 
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.refress_secret as string, {
    expiresIn: config.refress_expiry,
//     algorithm: 'HS256',
  } as any);
};


// verify jwt token and return decoded payload 
export const  verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.refress_secret as string) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};