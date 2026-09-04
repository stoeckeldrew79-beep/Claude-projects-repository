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

const skipDocker =
  process.argv.includes('--no-docker') || process.env.SCAMSHIELD_SKIP_DOCKER === '1';

// 'ready' = daemon is up, 'daemon-down' = CLI installed but not running, 'missing' = no CLI.
const dockerStatus = () => {
  const quiet = { stdio: 'ignore', shell: true };
  try {
    execFileSync('docker', ['info'], quiet);
    return 'ready';
  } catch {
    try {
      execFileSync('docker', ['--version'], quiet);
      return 'daemon-down';
    } catch {
      return 'missing';
    }
  }
};

const manualDbHint =
  'Already running Postgres and Redis some other way? Point DATABASE_URL and REDIS_URL\n' +
  'in backend/.env at them, then re-run setup with:\n\n' +
  '    npm run setup -- --no-docker';

if (skipDocker) {
  console.log(
    '\nSkipping Docker (--no-docker). Make sure DATABASE_URL and REDIS_URL in ' +
      'backend/.env point at a Postgres and Redis you are already running.'
  );
} else {
  const status = dockerStatus();
  if (status === 'missing') {
    console.error(
      '\nDocker was not found on this machine.\n\n' +
        'Setup uses Docker to run Postgres 16 and Redis 7 locally. Install Docker Desktop\n' +
        '(https://docs.docker.com/desktop/) and re-run "npm run setup".\n\n' +
        manualDbHint
    );
    process.exit(1);
  }
  if (status === 'daemon-down') {
    console.error(
      '\nDocker is installed, but the Docker daemon is not running.\n\n' +
        'Start Docker Desktop, wait until it reports "Docker Desktop is running",\n' +
        'then re-run "npm run setup".\n\n' +
        manualDbHint
    );
    process.exit(1);
  }
  run('docker', ['compose', 'up', '-d']);
}

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

// The root package holds `concurrently`, which `npm run dev` needs.
run('npm', ['install'], root);
run('npm', ['install'], path.join(root, 'backend'));
run('npm', ['install'], path.join(root, 'frontend'));
run('npm', ['run', 'migrate'], path.join(root, 'backend'));
run('npm', ['run', 'seed'], path.join(root, 'backend'));

console.log('\nSetup complete. Run "npm run dev" to start both servers, then open http://localhost:5173');
