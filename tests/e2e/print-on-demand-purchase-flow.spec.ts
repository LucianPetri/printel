import { expect, test } from '@playwright/test';
import {
  completeGuestCheckout,
  seedPrintOnDemandCatalog,
  seedRejectedCookieConsent,
  type SeededPrintOnDemandCatalog
} from './helpers/print-on-demand.js';

let catalog: SeededPrintOnDemandCatalog;

async function expectVisibleAfterReload(page, locator, timeout = 5000) {
  try {
    await expect(locator).toBeVisible({ timeout });
  } catch (error) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(locator).toBeVisible({ timeout: 15000 });
  }
}

test.describe.serial('Print-on-demand storefront purchase flow', () => {
  test.beforeAll(async () => {
    catalog = await seedPrintOnDemandCatalog('purchase-flow');
  });

  test('PDP, category, and search surfaces show category-specific POD messaging', async ({
    page
  }) => {
    await page.goto(catalog.products.simpleOutOfStock.url, {
      waitUntil: 'domcontentloaded'
    });
    await expectVisibleAfterReload(page, page.getByRole('button', { name: /Print Now/i }));
    await expect(page.getByTestId('pod-delivery-range')).toContainText(
      catalog.categories.simple.rangeLabel || ''
    );

    await page.goto(catalog.categories.simple.url, {
      waitUntil: 'domcontentloaded'
    });
    await expect(page.getByText(catalog.products.simpleOutOfStock.name)).toBeVisible();
    await page
      .locator('.product__list__item')
      .filter({ hasText: catalog.products.simpleOutOfStock.name })
      .first()
      .hover();
    await expect(page.getByRole('button', { name: /Print Now/i }).first()).toBeVisible();
    await expect(page.getByText(catalog.categories.simple.rangeLabel || '').first()).toBeVisible();

    await page.goto(`/search?keyword=${encodeURIComponent(catalog.searchKeyword)}`, {
      waitUntil: 'domcontentloaded'
    });
    await expect(page.getByText(catalog.products.simpleOutOfStock.name)).toBeVisible();
    await expect(page.getByText(catalog.products.complexOutOfStock.name)).toBeVisible();
    await expect(page.getByText(catalog.categories.simple.rangeLabel || '').first()).toBeVisible();
    await expect(page.getByText(catalog.categories.complex.rangeLabel || '').first()).toBeVisible();
  });

  test('out-of-stock POD products stay purchasable through cart reload and checkout', async ({
    page
  }) => {
    test.setTimeout(120000);
    await seedRejectedCookieConsent(page);
    await page.goto(catalog.products.simpleOutOfStock.url, {
      waitUntil: 'domcontentloaded'
    });
    const addToCartResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/cart/mine/items') &&
        response.request().method() === 'POST' &&
        response.status() === 200
    );
    await page.getByRole('button', { name: /Print Now/i }).click();
    await addToCartResponse;

    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(catalog.products.simpleOutOfStock.name)).toBeVisible();

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByText(catalog.products.simpleOutOfStock.name)).toBeVisible();

    await page.goto('/checkout', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await completeGuestCheckout(page);
    await expect(page.getByText(catalog.products.simpleOutOfStock.name)).toBeVisible();
  });
});
