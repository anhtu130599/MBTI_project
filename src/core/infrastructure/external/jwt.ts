// JWT utility functions

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  username: string;
  role?: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyJWT(token: string): JWTPayload {
  return verifyToken(token);
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

export function refreshToken(token: string): string | null {
  try {
    const decoded = verifyToken(token);
    const { iat: _iat, exp: _exp, ...payload } = decoded;
    return generateToken(payload);
  } catch {
    return null;
  }
}

// Legacy export for backward compatibility
export const signJWT = generateToken; 
