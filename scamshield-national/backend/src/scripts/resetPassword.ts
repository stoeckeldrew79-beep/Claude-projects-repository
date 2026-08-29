import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';

// One-off CLI tool for resetting a user's password directly in the
// database when they can't get back in through the normal login flow
// (e.g. a forgotten password with no reset-email flow wired up yet).
// Usage: npm run reset-password -- <email> <new-password>
const BCRYPT_ROUNDS = 12;

async function main() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    console.error('Usage: npm run reset-password -- <email> <new-password>');
    process.exit(1);
  }
  if (newPassword.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  const { rows } = await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE auth_provider_id = $2 RETURNING id, email',
    [passwordHash, email]
  );

  if (!rows[0]) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  console.log(`Password reset for ${rows[0].email}.`);
  await pool.end();
}

main();
