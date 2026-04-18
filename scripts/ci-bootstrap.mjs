import { spawn } from 'node:child_process';

const answers = [
  process.env.CI_DB_HOST || '127.0.0.1',
  process.env.CI_DB_PORT || '5432',
  process.env.CI_DB_NAME || 'evershop',
  process.env.CI_DB_USER || 'postgres',
  process.env.CI_DB_PASSWORD || 'postgres',
  process.env.CI_ADMIN_FULLNAME || 'Playwright Admin',
  process.env.CI_ADMIN_EMAIL || 'playwright-admin@printel.local',
  process.env.CI_ADMIN_PASSWORD || 'Playwright123!'
].join('\n') + '\n';

const env = { ...process.env };

for (const key of [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_SSLMODE',
  'ADMIN_FULLNAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
]) {
  delete env[key];
}

const child = spawn('npm', ['run', 'setup'], {
  cwd: process.cwd(),
  env,
  stdio: ['pipe', 'inherit', 'inherit']
});

child.stdin.end(answers);

const exitCode = await new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('close', resolve);
});

if (exitCode !== 0) {
  process.exit(exitCode ?? 1);
}