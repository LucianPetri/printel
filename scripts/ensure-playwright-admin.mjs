import { execFileSync } from 'node:child_process';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to create the Playwright admin user in production mode.');
}

function inspectDockerValue(containerName, format) {
  try {
    return execFileSync('docker', ['inspect', '-f', format, containerName], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

function resolveDbEnv() {
  const host =
    process.env.DB_HOST ||
    inspectDockerValue('printel-postgres', '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}') ||
    '127.0.0.1';

  const envLines = inspectDockerValue(
    'printel-postgres',
    '{{range .Config.Env}}{{println .}}{{end}}'
  )
    .split('\n')
    .filter(Boolean);
  const envMap = Object.fromEntries(
    envLines.map((line) => {
      const [key, ...rest] = line.split('=');
      return [key, rest.join('=')];
    })
  );

  return {
    DB_HOST: host,
    DB_PORT: process.env.DB_PORT || '5432',
    DB_NAME: process.env.DB_NAME || envMap.POSTGRES_DB || 'printel_dev',
    DB_USER: process.env.DB_USER || envMap.POSTGRES_USER || 'printel_dev',
    DB_PASSWORD: process.env.DB_PASSWORD || envMap.POSTGRES_PASSWORD || 'printel_dev',
    DB_SSLMODE: process.env.DB_SSLMODE || 'disable'
  };
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
    env: {
      ...process.env,
      ...resolveDbEnv()
    }
  }
);
