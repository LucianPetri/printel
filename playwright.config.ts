import { defineConfig, devices } from '@playwright/test';
import { execFileSync } from 'node:child_process';

function inspectDockerValue(containerName: string, format: string) {
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

function resolveDockerDbEnv() {
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
    host:
      process.env.DB_HOST ||
      inspectDockerValue('printel-postgres', '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}') ||
      '127.0.0.1',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || envMap.POSTGRES_DB || 'printel_dev',
    user: process.env.DB_USER || envMap.POSTGRES_USER || 'printel_dev',
    password: process.env.DB_PASSWORD || envMap.POSTGRES_PASSWORD || 'printel_dev',
    sslmode: process.env.DB_SSLMODE || 'disable'
  };
}

const localPort = process.env.PLAYWRIGHT_PORT || '3100';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${localPort}`;
const dbEnv = resolveDockerDbEnv();
const webServerCommand =
  process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ||
  [
    `PORT=${localPort}`,
    `SHOP_URL=${baseURL}`,
    `ADMIN_URL=${baseURL}/admin`,
    `DB_HOST=${dbEnv.host}`,
    `DB_PORT=${dbEnv.port}`,
    `DB_NAME=${dbEnv.database}`,
    `DB_USER=${dbEnv.user}`,
    `DB_PASSWORD=${dbEnv.password}`,
    `DB_SSLMODE=${dbEnv.sslmode}`,
    'npm run dev'
  ].join(' ');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  globalSetup: './tests/e2e/globalSetup.ts',
  webServer: {
    command: webServerCommand,
    url: `${baseURL}/admin/login`,
    reuseExistingServer: true,
    timeout: 180000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium'
      }
    }
  ]
});
