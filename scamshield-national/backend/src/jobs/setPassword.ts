// Sets a user's password from the command line. Passwords are bcrypt-hashed,
// so a forgotten one cannot be recovered — only replaced. There is no email
// reset flow yet, and locking the only admin account out of the admin panel
// is not an acceptable failure mode.
//
//   npm run set-password -- someone@example.com "new password here"
//
// Local operator tool: it needs database access, which is already full
// control over every account. Quote a password containing spaces.
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error('usage: npm run set-password -- <email> <new-password>');
    process.exit(1);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`setPassword: password must be at least ${MIN_PASSWORD_LENGTH} characters — the sign-in API enforces the same rule.`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  // Matched on email rather than auth_provider_id: that is what a person
  // knows about their own account, and registration sets the two the same.
  const { rows } = await pool.query(
    'UPDATE users SET password_hash = $1 WHERE lower(email) = lower($2) RETURNING id, email',
    [hash, email]
  );

  if (!rows[0]) {
    console.error(`setPassword: no account found for ${email}. Nothing changed.`);
    const { rows: all } = await pool.query('SELECT email FROM users ORDER BY created_at LIMIT 20');
    if (all.length) console.error(`Accounts on this database: ${all.map((r) => r.email).join(', ')}`);
    else console.error('This database has no accounts at all — register one on the site first.');
    await pool.end();
    process.exit(1);
  }

  console.log(`setPassword: password updated for ${rows[0].email}.`);
  console.log('Sign in with it now. Admin rights come from ADMIN_EMAILS and are stamped into the token at sign-in.');
  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
