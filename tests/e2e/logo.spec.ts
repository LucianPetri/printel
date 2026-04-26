import { expect, test } from '@playwright/test';

const adminEmail =
  process.env.PLAYWRIGHT_ADMIN_EMAIL || 'playwright-admin@printel.local';
const adminPassword =
  process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'Playwright123!';

async function loginToAdmin(page) {
  await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Parola').fill(adminPassword);
  await page.getByRole('button', { name: /Sign In|Autentificare/i }).click();
  const adminHeaderLogo = page.locator('.printel-admin-logo a').first();
  await Promise.race([
    page.waitForURL(/\/admin(?:\/dashboard)?(?:\?.*)?$/, { timeout: 30000 }),
    adminHeaderLogo.waitFor({ state: 'visible', timeout: 30000 })
  ]);
  await expect(adminHeaderLogo).toBeVisible();
}

test.describe('Logo branding', () => {
  test('storefront navbar uses the text SVG logo', async ({ page }) => {
    await page.goto('/accessories/stainless-steel-thermos-white', {
      waitUntil: 'domcontentloaded'
    });

    const storefrontLogo = page.locator('img[alt="Printel"]').first();
    await expect(storefrontLogo).toBeVisible();
    await expect(storefrontLogo).toHaveAttribute('src', /logo_plus_text\.svg/);
  });

  test('admin login and header use the current Printel admin branding', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /Sign In|Autentificare/i })).toBeVisible();

    await loginToAdmin(page);

    const adminHeaderLogo = page.locator('.printel-admin-logo a').first();
    await expect(adminHeaderLogo).toBeVisible();
    await expect(adminHeaderLogo).toContainText(/Printel Admin Panel/i);
  });
});
