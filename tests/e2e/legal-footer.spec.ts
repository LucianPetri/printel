import { expect, test } from '@playwright/test';

const adminEmail =
  process.env.PLAYWRIGHT_ADMIN_EMAIL || 'playwright-admin@printel.local';
const adminPassword =
  process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'Playwright123!';

const companyData = {
  companyLegalName: 'PRINTEL MEDIA SRL',
  companyLegalForm: 'SRL',
  companyTaxId: 'RO12345678',
  companyTradeRegister: 'J40/1234/2024',
  companyRegisteredOffice: 'Str. Tiparului nr. 10, Bucuresti, Romania',
  storeEmail: 'contact@printel.ro',
  storePhone: '+40 721 000 000',
  companyContactEmail: 'legal@printel.ro',
  companyContactPhone: '+40 723 123 123'
};

async function loginToAdmin(page) {
  await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Parola').fill(adminPassword);
  await page.getByRole('button', { name: /Sign In|Autentificare/i }).click();
  await expect(page).toHaveURL(/\/admin(?:\/dashboard)?(?:\?.*)?$/, {
    timeout: 15000
  });
}

test.describe.serial('Romanian legal footer', () => {
  test('admin exposes and saves the legal footer fields', async ({ page }) => {
    test.setTimeout(60000);

    await loginToAdmin(page);
    await page.goto('/admin/setting/store', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByText(/Legal Footer Information|Informații legale footer/i)
    ).toBeVisible();

    await page.locator('[name="companyLegalName"]').fill(companyData.companyLegalName);
    await page.locator('[name="companyLegalForm"]').fill(companyData.companyLegalForm);
    await page.locator('[name="companyTaxId"]').fill(companyData.companyTaxId);
    await page
      .locator('[name="companyTradeRegister"]')
      .fill(companyData.companyTradeRegister);
    await page
      .locator('[name="companyContactEmail"]')
      .fill(companyData.companyContactEmail);
    await page
      .locator('[name="companyContactPhone"]')
      .fill(companyData.companyContactPhone);
    await page
      .locator('[name="companyRegisteredOffice"]')
      .fill(companyData.companyRegisteredOffice);

    await page.getByLabel('Store Email').fill(companyData.storeEmail);
    await page.getByLabel('Store Phone Number').fill(companyData.storePhone);

    const saveRequest = page.waitForResponse(
      (response) =>
        response.url().includes('/api/settings') && response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: /Save|Salvează/i }).click();
    const response = await saveRequest;
    expect(response.ok()).toBeTruthy();
    await expect(page.getByText(/Saved successfully!|Salvat cu succes!/i)).toBeVisible();

    await page.reload();
    await expect(page.locator('[name="companyLegalName"]')).toHaveValue(
      companyData.companyLegalName
    );
    await expect(page.locator('[name="companyRegisteredOffice"]')).toHaveValue(
      companyData.companyRegisteredOffice
    );
  });

  test('storefront renders company info and fixed ANPC banners', async ({ page }) => {
    await page.goto('/accessories/stainless-steel-thermos-white', {
      waitUntil: 'domcontentloaded'
    });

    await expect(page.getByTestId('legal-footer')).toBeVisible();
    await expect(page.getByText(companyData.companyLegalName)).toBeVisible();
    await expect(page.getByText(companyData.companyTaxId)).toBeVisible();
    await expect(page.getByText(companyData.companyRegisteredOffice)).toBeVisible();

    await expect(page.getByTestId('anpc-complaints-banner')).toHaveAttribute(
      'href',
      'https://eservicii.anpc.ro/'
    );
    await expect(page.getByTestId('anpc-sal-banner')).toHaveAttribute(
      'href',
      'https://reclamatiisal.anpc.ro/'
    );

    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('legal-footer')).toBeVisible();
    await expect(page.getByText(companyData.companyContactEmail)).toBeVisible();
    await expect(page.getByText(companyData.companyContactPhone)).toBeVisible();
  });
});