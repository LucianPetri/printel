import { execFileSync } from 'node:child_process';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to create the Playwright admin user in production mode.');
}

const name = process.env.PLAYWRIGHT_ADMIN_NAME || 'Playwright Admin';
const email = process.env.PLAYWRIGHT_ADMIN_EMAIL || 'playwright-admin@printel.local';
const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'Playwright123!';

execFileSync(
  'npm',
  [
    'run',
    'user:create',
    '--',
    '--name',
    name,
    '--email',
    email,
    '--password',
    password
  ],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env
  }
);