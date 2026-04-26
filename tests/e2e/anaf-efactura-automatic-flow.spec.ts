import { expect, test } from '@playwright/test';
import {
  anafSandboxEnabled,
  expectAnafSettingsContent,
  fetchAnafConnectRedirectUrl,
  openAnafSettings
} from './helpers/anaf-efactura';
import { completeGuestCheckout, dismissCookieBanner } from './helpers/print-on-demand';

test.describe('ANAF automatic flow', () => {
  test.skip(!anafSandboxEnabled, 'ANAF sandbox scenarios are opt-in');

  test('automatic ANAF submission exposes the automatic-mode controls needed for delayed confirmation', async ({
    page
  }) => {
    await openAnafSettings(page);
    await expectAnafSettingsContent(page);
    await expect(page.getByLabel(/Submission policy/i)).toContainText(/Automatic on order placement/i);
    await expect(
      page.getByText(/choose sandbox or live mode, and decide whether ANAF submission runs automatically/i)
    ).toBeVisible();

    const redirectUrl = await fetchAnafConnectRedirectUrl(page);
    expect(redirectUrl).toContain('client_id=');

    const productUrl = process.env.ANAF_E2E_PRODUCT_URL;
    test.skip(
      !productUrl,
      'Set ANAF_E2E_PRODUCT_URL to run the full automatic checkout scenario in sandbox.'
    );

    await dismissCookieBanner(page);
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await page
      .getByRole('button', { name: /Add to Cart|Print Now|Adaugă în coș/i })
      .first()
      .click();
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await completeGuestCheckout(page, `anaf-auto-${Date.now()}@printel.local`);
    await expect(page.getByText(/Order #|Thank you|Mulțumim/i).first()).toBeVisible();
  });
});
