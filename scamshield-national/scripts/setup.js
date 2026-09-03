#!/usr/bin/env node
// One-shot local setup: starts Postgres/Redis, writes a dev .env if missing,
// installs both apps, and runs migrations + seed data.
const { execFileSync } = require('child_process');
const { existsSync, copyFileSync, readFileSync, writeFileSync } = require('fs');
const { randomBytes } = require('crypto');
const path = require('path');

const root = path.join(__dirname, '..');
const run = (cmd, args, cwd) => {
  console.log(`\n> ${cmd} ${args.join(' ')}${cwd ? `  (in ${cwd})` : ''}`);
  execFileSync(cmd, args, { cwd: cwd || root, stdio: 'inherit', shell: true });
};

run('docker', ['compose', 'up', '-d']);

const envPath = path.join(root, 'backend', '.env');
const envExamplePath = path.join(root, '.env.example');
if (!existsSync(envPath)) {
  console.log('\nNo backend/.env found — creating one with a generated JWT_SECRET.');
  copyFileSync(envExamplePath, envPath);
  const contents = readFileSync(envPath, 'utf8').replace(
    'JWT_SECRET=change-me-in-every-environment',
    `JWT_SECRET=${randomBytes(32).toString('hex')}`
  );
  writeFileSync(envPath, contents);
  console.log(
    'Set ADMIN_EMAILS in backend/.env to your email if you want access to /admin. ' +
      'Stripe/Twilio/SendGrid/Anthropic keys are optional for just browsing the app.'
  );
} else {
  console.log('\nbackend/.env already exists — leaving it as is.');
}

run('npm', ['install'], path.join(root, 'backend'));
run('npm', ['install'], path.join(root, 'frontend'));
run('npm', ['run', 'migrate'], path.join(root, 'backend'));
run('npm', ['run', 'seed'], path.join(root, 'backend'));

console.log('\nSetup complete. Run "npm run dev" to start both servers, then open http://localhost:5173');
