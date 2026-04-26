import { expect, test } from '@playwright/test';
import {
  anafSandboxEnabled,
  fetchAnafConnectRedirectUrl,
  openAnafSettings
} from './helpers/anaf-efactura';

test.describe('ANAF sandbox validation', () => {
  test.skip(!anafSandboxEnabled, 'ANAF sandbox scenarios are opt-in');

  test('sandbox validation suite is enabled only with explicit env flags', async ({ page }) => {
    await openAnafSettings(page);
    const redirectUrl = await fetchAnafConnectRedirectUrl(page);
    expect(redirectUrl).toMatch(/test|oauth/i);
    expect(process.env.RUN_ANAF_E2E === 'true' || process.env.ANAF_SANDBOX_E2E === 'true').toBe(
      true
    );
  });
});
