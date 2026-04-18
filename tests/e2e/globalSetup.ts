import { execFileSync } from 'node:child_process';
import type { FullConfig } from '@playwright/test';

export default async function globalSetup(_config: FullConfig) {
  if (process.env.SKIP_PLAYWRIGHT_ADMIN_SETUP === 'true') {
    return;
  }

  execFileSync('npm', ['run', 'ensure:test-admin'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'test'
    }
  });
}