import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthedRequest } from '../middleware/auth';
import * as UsersModel from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';

// Dev-mode auth: real password check against a local bcrypt hash, in
// place of Auth0/Supabase (spec section 5.4) until that's wired up.
// Previously this issued a session for any *registered* email with no
// secret check at all — a full authentication bypass — so this exists
// as a minimum-viable real auth mechanism, not just a stand-in shape.
const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

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
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  const existing = await UsersModel.getUserByAuthId(email);
  if (existing) return res.status(409).json({ error: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await UsersModel.createUser({ authProviderId: email, email, passwordHash });
  res.status(201).json({ data: UsersModel.sanitizeUser(user), token: issueToken(user) });
});

export const login = asyncHandler<AuthedRequest>(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const user = await UsersModel.getUserByAuthId(email);
  // Compare against a dummy hash when the user doesn't exist so lookup
  // and mismatch take a comparable amount of time either way.
  const hash = user?.password_hash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
  const valid = await bcrypt.compare(password, hash);
  if (!user || !valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ data: UsersModel.sanitizeUser(user), token: issueToken(user) });
});
