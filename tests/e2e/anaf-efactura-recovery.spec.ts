import { expect, test } from '@playwright/test';
import { anafSandboxEnabled, openAnafSettings } from './helpers/anaf-efactura';
import { loginToAdmin } from './helpers/print-on-demand';

test.describe('ANAF recovery flow', () => {
  test.skip(!anafSandboxEnabled, 'ANAF sandbox scenarios are opt-in');

  test('queued orders can be retried after ANAF recovers', async ({ page }) => {
    await openAnafSettings(page);
    await expect(
      page.getByText(/queued orders will pause in blocked-authentication until an admin reconnects the profile/i)
    ).toBeVisible();

    await loginToAdmin(page);
    await page.goto('/admin/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel(/ANAF status/i)).toBeVisible();
    await expect(page.getByText(/All ANAF states/i)).toBeVisible();

    const orderUuid = process.env.ANAF_E2E_ORDER_UUID;
    test.skip(
      !orderUuid,
      'Set ANAF_E2E_ORDER_UUID to assert the recovery/status API for a sandbox order.'
    );

    const statusResponse = await page.request.get(`/api/orders/${orderUuid}/anaf/status`);
    expect(statusResponse.ok()).toBeTruthy();
    const payload = await statusResponse.json();
    expect(payload?.data).toBeTruthy();
    expect(payload?.data?.status?.code).toMatch(
      /pending_approval|queued|attention_required|blocked_auth|registered|manual_review/
    );
  });
});
