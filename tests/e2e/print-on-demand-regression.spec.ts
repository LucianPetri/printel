import { expect, test } from '@playwright/test';
import {
  seedPrintOnDemandCatalog,
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

test.describe.serial('Print-on-demand storefront regressions', () => {
  test.beforeAll(async () => {
    catalog = await seedPrintOnDemandCatalog('regression');
  });

  test('in-stock products in POD categories keep the normal resale CTA and delivery behavior', async ({
    page
  }) => {
    await page.goto(catalog.products.simpleInStock.url, {
      waitUntil: 'domcontentloaded'
    });
    await expect(
      page.getByRole('button', { name: /ADD TO CART|Add to Cart|Adaugă în coș/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Print Now/i })).toHaveCount(0);
    await expect(page.getByTestId('pod-delivery-range')).toHaveCount(0);

    await page.goto(catalog.categories.simple.url, {
      waitUntil: 'domcontentloaded'
    });
    await expect(page.getByText(catalog.products.simpleInStock.name)).toBeVisible();
    await page
      .locator('.product__list__item')
      .filter({ hasText: catalog.products.simpleInStock.name })
      .first()
      .hover();
    await expect(
      page.getByRole('button', { name: /Add to Cart|Adaugă în coș/i }).first()
    ).toBeVisible();
  });

  test('out-of-stock non-POD products do not switch to POD messaging', async ({
    page
  }) => {
    await page.goto(catalog.products.standardOutOfStock.url, {
      waitUntil: 'domcontentloaded'
    });
    await expect(page.getByRole('button', { name: /Print Now/i })).toHaveCount(0);
    await expect(page.getByTestId('pod-delivery-range')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /SOLD OUT|Out of Stock|Stoc epuizat/i })
    ).toBeVisible();

    await page.goto(`/search?keyword=${encodeURIComponent(catalog.searchKeyword)}`, {
      waitUntil: 'domcontentloaded'
    });
    await expect(page.getByText(catalog.products.standardOutOfStock.name)).toBeVisible();
    await expectVisibleAfterReload(
      page,
      page.getByText(catalog.categories.simple.rangeLabel || '').first()
    );
    await expect(page.getByText(catalog.categories.standard.name)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Print Now/i })).toHaveCount(0);
  });
});
