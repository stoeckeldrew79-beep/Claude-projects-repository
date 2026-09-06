// Sets a user's password from the command line. Passwords are bcrypt-hashed,
// so a forgotten one cannot be recovered — only replaced. There is no email
// reset flow yet, and locking the only admin account out of the admin panel
// is not an acceptable failure mode.
//
//   npm run set-password -- someone@example.com
//
// Asks for the password rather than taking it on the command line. A written
// example is a trap: the obvious thing to do with one is paste it, and a
// password pasted from documentation is the password you end up with. It also
// keeps the real one out of shell history and out of the process list.
//
// A password may still be passed as a second argument for scripted use.
//
// Local operator tool: it needs database access, which is already full
// control over every account.
import 'dotenv/config';
import readline from 'readline';
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

// Prompts for a password twice without echoing it.
//
// One readline interface is created for the whole exchange and reused. A
// fresh interface per question works until the first retry: closing one ends
// the shared stdin, so the next question never fires and the process exits
// silently having done nothing.
async function readNewPassword(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const internals = rl as unknown as { _writeToOutput: (s: string) => void };
  const write = process.stdout.write.bind(process.stdout);
  let muted = false;
  // The prompt is written before muting, so the question shows and the
  // answer does not.
  internals._writeToOutput = (s: string) => {
    if (!muted) write(s);
  };

  let closed = false;
  rl.on('close', () => {
    closed = true;
  });

  // Resolves empty on EOF rather than hanging forever on a stdin that has
  // nothing left to give.
  const ask = (question: string) =>
    new Promise<string>((resolve) => {
      if (closed) return resolve('');
      rl.once('close', () => resolve(''));
      muted = false;
      rl.question(question, (answer) => {
        write('\n');
        muted = false;
        resolve(answer);
      });
      muted = true;
    });

  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const first = await ask(`New password (at least ${MIN_PASSWORD_LENGTH} characters, not shown as you type): `);
      if (closed && !first) break;
      if (first.length < MIN_PASSWORD_LENGTH) {
        console.error(`  Too short — needs at least ${MIN_PASSWORD_LENGTH} characters.`);
        continue;
      }
      // Typed twice because it is never echoed: a typo would otherwise lock
      // the account rather than announce itself.
      const second = await ask('Type it again to confirm: ');
      if (first !== second) {
        console.error("  Those didn't match.");
        continue;
      }
      return first;
    }
  } finally {
    rl.close();
  }

  console.error('setPassword: no password set. Nothing changed.');
  await pool.end();
  process.exit(1);
}

async function main() {
  const [email, passwordArg] = process.argv.slice(2);
  if (!email) {
    console.error('usage: npm run set-password -- <email>');
    process.exit(1);
  }
  if (passwordArg !== undefined && passwordArg.length < MIN_PASSWORD_LENGTH) {
    console.error(`setPassword: password must be at least ${MIN_PASSWORD_LENGTH} characters — the sign-in API enforces the same rule.`);
    process.exit(1);
  }
  const password = passwordArg ?? (await readNewPassword());

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
