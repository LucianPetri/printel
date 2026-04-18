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
  await expect(page).toHaveURL(/\/admin(?:\/dashboard)?(?:\?.*)?$/, {
    timeout: 15000
  });
}

test.describe('Logo branding', () => {
  test('storefront navbar uses the text SVG logo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const storefrontLogo = page.locator('img[alt="Printel"]').first();
    await expect(storefrontLogo).toBeVisible();
    await expect(storefrontLogo).toHaveAttribute('src', /logo_plus_text\.svg/);
  });

  test('admin login and header use the icon SVG logo', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });

    const loginBrand = page.locator('[data-printel-login-brand]');
    await expect(loginBrand).toHaveCount(1);
    await expect(loginBrand).toHaveCSS('background-image', /logo_only\.svg/);

    await loginToAdmin(page);

    const adminHeaderLogo = page.locator('.printel-admin-logo a').first();
    await expect(adminHeaderLogo).toBeVisible();
    await expect(adminHeaderLogo).toHaveCSS('background-image', /logo_only\.svg/);
  });
});