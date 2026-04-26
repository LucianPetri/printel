import { expect, test } from '@playwright/test';
import {
  anafSandboxEnabled,
  expectAnafSettingsContent,
  fetchAnafConnectRedirectUrl,
  openAnafSettings
} from './helpers/anaf-efactura';

test.describe('ANAF admin settings', () => {
  test.skip(!anafSandboxEnabled, 'ANAF sandbox scenarios are opt-in');

  test('admins can review ANAF settings guidance and manual mode', async ({ page }) => {
    await openAnafSettings(page);
    await expectAnafSettingsContent(page);
    await expect(page.getByLabel(/Submission policy/i)).toContainText(/Automatic|Manual/i);

    const redirectUrl = await fetchAnafConnectRedirectUrl(page);
    expect(redirectUrl).toContain('redirect_uri=');
  });
});
