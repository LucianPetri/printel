import { expect, test } from '@playwright/test';
import {
  anafSandboxEnabled,
  expectAnafSettingsContent,
  fetchAnafConnectRedirectUrl,
  openAnafSettings
} from './helpers/anaf-efactura';

test.describe('ANAF admin settings', () => {
  async function selectComboboxOption(page, label: RegExp, option: RegExp) {
    const combobox = page.getByRole('combobox', { name: label });
    await combobox.click();
    await page.getByRole('option', { name: option }).click();
    await expect(combobox).toContainText(option);
  }

  test('admins can save and reopen ANAF settings', async ({ page }) => {
    await openAnafSettings(page);
    await expectAnafSettingsContent(page);

    const enabledToggle = page.locator('#field-anafEnabled');
    await enabledToggle.setChecked(true, { force: true });
    await expect(enabledToggle).toBeChecked();

    await selectComboboxOption(page, /ANAF environment/i, /Live \/ production/i);
    await selectComboboxOption(page, /Submission policy/i, /Manual approval required/i);
    await page.getByLabel(/Company tax identifier/i).fill('RO99999999');

    const saveRequest = page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings') && response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: /Save|Salvează/i }).click();
    const response = await saveRequest;
    expect(response.ok()).toBeTruthy();
    await expect(page.getByText(/Saved successfully!|Salvat cu succes!/i)).toBeVisible();

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#field-anafEnabled')).toBeChecked();
    await expect(page.getByRole('combobox', { name: /ANAF environment/i })).toContainText(
      /Live \/ production/i
    );
    await expect(page.getByRole('combobox', { name: /Submission policy/i })).toContainText(
      /Manual approval required/i
    );
    await expect(page.getByLabel(/Company tax identifier/i)).toHaveValue('RO99999999');
  });

  test('admins can review ANAF settings guidance and manual mode', async ({ page }) => {
    test.skip(!anafSandboxEnabled, 'ANAF sandbox scenarios are opt-in');

    await openAnafSettings(page);
    await expectAnafSettingsContent(page);
    await expect(page.getByLabel(/Submission policy/i)).toContainText(/Automatic|Manual/i);

    const redirectUrl = await fetchAnafConnectRedirectUrl(page);
    expect(redirectUrl).toContain('redirect_uri=');
  });
});
