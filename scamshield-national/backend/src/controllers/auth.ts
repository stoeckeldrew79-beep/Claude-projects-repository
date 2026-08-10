import jwt from 'jsonwebtoken';
import { AuthedRequest } from '../middleware/auth';
import * as UsersModel from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';

// Dev-mode auth: issues a JWT directly against the local users table.
// Phase 2 replaces this with real Auth0/Supabase login (JWKS-verified
// tokens) per spec section 5.4 — this exists so the rest of the API is
// exercisable before that integration lands.
function issueToken(user: { id: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  // Dev-only: real role assignment comes from the auth provider's role
  // claims (spec 5.4) once Auth0/Supabase is wired up. Until then,
  // ADMIN_EMAILS is the only way to reach the admin panel at all.
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase());
  const role = adminEmails.includes(user.email.toLowerCase()) ? 'admin' : 'user';
  return jwt.sign({ sub: user.id, role }, secret, { expiresIn: '7d' });
}

export const register = asyncHandler<AuthedRequest>(async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: 'email is required' });

  const existing = await UsersModel.getUserByAuthId(email);
  if (existing) return res.status(409).json({ error: 'User already exists' });

  const user = await UsersModel.createUser({ authProviderId: email, email });
  res.status(201).json({ data: user, token: issueToken(user) });
});

export const login = asyncHandler<AuthedRequest>(async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: 'email is required' });

  const user = await UsersModel.getUserByAuthId(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ data: user, token: issueToken(user) });
});
