import { expect, Page, test as base } from '@playwright/test';
import { loginToAdmin } from './print-on-demand.js';

export const anafSandboxEnabled =
  process.env.RUN_ANAF_E2E === 'true' || process.env.ANAF_SANDBOX_E2E === 'true';

export async function skipUnlessAnafSandboxEnabled() {
  base.skip(!anafSandboxEnabled, 'ANAF sandbox scenarios are opt-in');
}

export async function openAnafSettings(page: Page) {
  await loginToAdmin(page);
  await page.goto('/admin/setting/store', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /ANAF e-Factura \/ SPV/i })).toBeVisible();
}

export async function expectAnafSettingsContent(page: Page) {
  await expect(
    page.getByLabel(/Enable ANAF-controlled order confirmation/i)
  ).toBeVisible();
  await expect(page.getByLabel(/ANAF environment/i)).toBeVisible();
  await expect(page.getByLabel(/Submission policy/i)).toBeVisible();
  await expect(page.getByLabel(/Company tax identifier/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Connect \/ reconnect/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Check connection/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible();
  await expect(
    page.getByText(/queued orders will pause in blocked-authentication/i)
  ).toBeVisible();
}

export async function fetchAnafConnectRedirectUrl(page: Page) {
  const response = await page.request.post('/api/anaf/connect/start');
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  const redirectUrl = String(payload?.data?.redirectUrl || '');
  expect(redirectUrl).toMatch(/https:\/\/.*anaf/i);
  return redirectUrl;
}
