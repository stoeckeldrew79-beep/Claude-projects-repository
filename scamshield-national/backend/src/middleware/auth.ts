import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type UserRole = 'user' | 'subscriber' | 'admin';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// Verifies the Bearer JWT against JWT_SECRET. Auth0/Supabase issue JWTs
// signed with their own keys (JWKS) in production — swap this for JWKS
// verification when wiring up the real provider in Phase 2.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const token = header.slice('Bearer '.length);
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');
    const payload = jwt.verify(token, secret) as { sub: string; role?: UserRole };
    req.user = { id: payload.sub, role: payload.role ?? 'user' };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
