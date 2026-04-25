import { expect, Page } from '@playwright/test';
import pg from 'pg';
import { printOnDemandCatalogFixtures } from '../fixtures/print-on-demand-catalog.js';

export const adminEmail =
  process.env.PLAYWRIGHT_ADMIN_EMAIL || 'playwright-admin@printel.local';
export const adminPassword =
  process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'Playwright123!';

const cookieConsentStorageKey = 'printel_cookie_consent_v1';
const checkoutZoneName = 'Playwright Romania Zone';
const checkoutMethodName = 'Playwright Flat Rate';
const checkoutCountryCode = 'RO';
const checkoutMethodCost = '19.9000';

type DeliveryUnit = 'days' | 'weeks';
type Queryable = Pick<pg.Pool, 'query'>;

interface SeededCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  url: string;
  rangeLabel: string | null;
}

interface SeededProduct {
  id: number;
  uuid: string;
  sku: string;
  name: string;
  slug: string;
  url: string;
}

export interface SeededPrintOnDemandCatalog {
  categories: {
    simple: SeededCategory;
    complex: SeededCategory;
    premium: SeededCategory;
    standard: SeededCategory;
  };
  products: {
    simpleOutOfStock: SeededProduct;
    complexOutOfStock: SeededProduct;
    premiumOutOfStock: SeededProduct;
    simpleInStock: SeededProduct;
    standardOutOfStock: SeededProduct;
  };
  searchKeyword: string;
}

function createSuffix(scope: string) {
  const normalizedScope = scope
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${normalizedScope}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function singularizeUnit(unit: DeliveryUnit) {
  return unit === 'days' ? 'day' : 'week';
}

function formatRangeLabel(
  min: number,
  max: number,
  unit: DeliveryUnit
): string {
  if (min === max) {
    const normalizedUnit = min === 1 ? singularizeUnit(unit) : unit;
    return `Print-on-demand delivery: ${min} ${normalizedUnit}`;
  }

  return `Print-on-demand delivery: ${min}-${max} ${unit}`;
}

function createDbPool() {
  const { Pool } = pg;

  return new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'evershop',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl:
      process.env.DB_SSLMODE && process.env.DB_SSLMODE !== 'disable'
        ? { rejectUnauthorized: false }
        : undefined
  });
}

function getStorefrontBaseUrl() {
  const port = process.env.PLAYWRIGHT_PORT || '3001';
  return process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;
}

async function waitForStorefrontMarkup(
  path: string,
  expectedTexts: string[],
  timeoutMs = 20000
) {
  const startedAt = Date.now();
  const url = `${getStorefrontBaseUrl()}${path}`;
  let lastBody = '';

  while (Date.now() - startedAt < timeoutMs) {
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.text();
      lastBody = body;
      if (expectedTexts.every((text) => body.includes(text))) {
        return;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Timed out waiting for storefront route ${path} to include: ${expectedTexts.join(', ')}. Last body length: ${lastBody.length}`
  );
}

async function warmSeededCatalogStorefront(catalog: SeededPrintOnDemandCatalog) {
  const simpleRangeLabel = catalog.categories.simple.rangeLabel;
  if (!simpleRangeLabel) {
    return;
  }

  await waitForStorefrontMarkup(catalog.products.simpleOutOfStock.url, [
    'Print Now',
    simpleRangeLabel
  ]);
  await waitForStorefrontMarkup(catalog.categories.simple.url, [
    catalog.products.simpleOutOfStock.name,
    simpleRangeLabel
  ]);
  await waitForStorefrontMarkup(
    `/search?keyword=${encodeURIComponent(catalog.searchKeyword)}`,
    [catalog.products.standardOutOfStock.name, simpleRangeLabel]
  );
}

async function ensureCheckoutConfiguration(db: Queryable) {
  await db.query(
    `
      INSERT INTO setting (name, value, is_json)
      VALUES
        ('codPaymentStatus', '1', false),
        ('codDisplayName', 'Cash on Delivery', false)
      ON CONFLICT (name) DO UPDATE
      SET value = EXCLUDED.value,
          is_json = EXCLUDED.is_json
    `
  );

  const zoneResult = await db.query(
    `
      SELECT shipping_zone_id
      FROM shipping_zone
      WHERE name = $1
        AND country = $2
      ORDER BY shipping_zone_id ASC
      LIMIT 1
    `,
    [checkoutZoneName, checkoutCountryCode]
  );

  const zoneId =
    zoneResult.rows[0]?.shipping_zone_id ??
    (
      await db.query(
        `
          INSERT INTO shipping_zone (name, country)
          VALUES ($1, $2)
          RETURNING shipping_zone_id
        `,
        [checkoutZoneName, checkoutCountryCode]
      )
    ).rows[0].shipping_zone_id;

  const methodResult = await db.query(
    `
      INSERT INTO shipping_method (name)
      VALUES ($1)
      ON CONFLICT (name) DO UPDATE
      SET name = EXCLUDED.name
      RETURNING shipping_method_id
    `,
    [checkoutMethodName]
  );

  const methodId = methodResult.rows[0].shipping_method_id;

  await db.query(
    `
      INSERT INTO shipping_zone_method (
        method_id,
        zone_id,
        is_enabled,
        cost,
        calculate_api,
        condition_type,
        max,
        min,
        price_based_cost,
        weight_based_cost
      )
      VALUES ($1, $2, true, $3, null, null, null, null, null, null)
      ON CONFLICT (zone_id, method_id) DO UPDATE
      SET is_enabled = EXCLUDED.is_enabled,
          cost = EXCLUDED.cost,
          calculate_api = EXCLUDED.calculate_api,
          condition_type = EXCLUDED.condition_type,
          max = EXCLUDED.max,
          min = EXCLUDED.min,
          price_based_cost = EXCLUDED.price_based_cost,
          weight_based_cost = EXCLUDED.weight_based_cost
    `,
    [methodId, zoneId, checkoutMethodCost]
  );
}

async function insertCategory({
  db,
  name,
  slug,
  pod
}: {
  db: Queryable;
  name: string;
  slug: string;
  pod?: {
    min: number;
    max: number;
    unit: DeliveryUnit;
  };
}): Promise<SeededCategory> {
  const categoryResult = await db.query(
    `
      INSERT INTO category (
        status,
        parent_id,
        include_in_nav,
        position,
        show_products,
        print_on_demand_enabled,
        print_on_demand_min,
        print_on_demand_max,
        print_on_demand_unit
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING category_id, uuid
    `,
    [
      true,
      null,
      true,
      null,
      true,
      Boolean(pod),
      pod?.min ?? null,
      pod?.max ?? null,
      pod?.unit ?? null
    ]
  );

  const category = categoryResult.rows[0];

  await db.query(
    `
      INSERT INTO category_description (
        category_description_category_id,
        name,
        short_description,
        description,
        image,
        meta_title,
        meta_keywords,
        meta_description,
        url_key
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      category.category_id,
      name,
      null,
      name,
      null,
      name,
      name,
      name,
      slug
    ]
  );

  await db.query(
    `
      INSERT INTO url_rewrite (language, request_path, target_path, entity_uuid, entity_type)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (language, entity_uuid) DO UPDATE
      SET request_path = EXCLUDED.request_path,
          target_path = EXCLUDED.target_path,
          entity_type = EXCLUDED.entity_type
    `,
    ['ro', `/${slug}`, `/category/${category.uuid}`, category.uuid, 'category']
  );

  return {
    id: category.category_id,
    uuid: category.uuid,
    name,
    slug,
    url: `/${slug}`,
    rangeLabel: pod ? formatRangeLabel(pod.min, pod.max, pod.unit) : null
  };
}

async function insertProduct({
  db,
  name,
  slug,
  sku,
  categoryId,
  price,
  qty,
  manageStock,
  stockAvailability
}: {
  db: Queryable;
  name: string;
  slug: string;
  sku: string;
  categoryId: number;
  price: number;
  qty: number;
  manageStock: boolean;
  stockAvailability: boolean;
}): Promise<SeededProduct> {
  const productResult = await db.query(
    `
      INSERT INTO product (
        type,
        variant_group_id,
        visibility,
        group_id,
        sku,
        price,
        weight,
        tax_class,
        status,
        category_id,
        no_shipping_required
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING product_id, uuid
    `,
    [
      'simple',
      null,
      true,
      1,
      sku,
      price,
      0.25,
      null,
      true,
      categoryId,
      false
    ]
  );

  const product = productResult.rows[0];

  await db.query(
    `
      INSERT INTO product_description (
        product_description_product_id,
        name,
        short_description,
        description,
        meta_title,
        meta_keywords,
        meta_description,
        url_key
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [product.product_id, name, null, name, name, name, name, slug]
  );

  await db.query(
    `
      INSERT INTO url_rewrite (language, request_path, target_path, entity_uuid, entity_type)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (language, entity_uuid) DO UPDATE
      SET request_path = EXCLUDED.request_path,
          target_path = EXCLUDED.target_path,
          entity_type = EXCLUDED.entity_type
    `,
    ['ro', `/${slug}`, `/product/${product.uuid}`, product.uuid, 'product']
  );

  await db.query(
    `
      INSERT INTO product_inventory (
        product_inventory_product_id,
        qty,
        manage_stock,
        stock_availability
      )
      VALUES ($1, $2, $3, $4)
    `,
    [product.product_id, qty, manageStock, stockAvailability]
  );

  return {
    id: product.product_id,
    uuid: product.uuid,
    sku,
    name,
    slug,
    url: `/${slug}`
  };
}

export async function seedPrintOnDemandCatalog(
  scope = 'pod'
): Promise<SeededPrintOnDemandCatalog> {
  const suffix = createSuffix(scope);
  const uniqueName = (value: string) => `${value} ${suffix}`;
  const uniqueSlug = (value: string) => `${value}-${suffix}`;
  const uniqueSku = (value: string) => `${value}-${suffix}`.toUpperCase();
  const db = createDbPool();

  try {
    await ensureCheckoutConfiguration(db);

    const simple = await insertCategory({
      db,
      name: uniqueName(printOnDemandCatalogFixtures.categories.simple.name),
      slug: uniqueSlug(printOnDemandCatalogFixtures.categories.simple.slug),
      pod: printOnDemandCatalogFixtures.categories.simple.range
    });
    const complex = await insertCategory({
      db,
      name: uniqueName(printOnDemandCatalogFixtures.categories.complex.name),
      slug: uniqueSlug(printOnDemandCatalogFixtures.categories.complex.slug),
      pod: printOnDemandCatalogFixtures.categories.complex.range
    });
    const premium = await insertCategory({
      db,
      name: uniqueName(printOnDemandCatalogFixtures.categories.premium.name),
      slug: uniqueSlug(printOnDemandCatalogFixtures.categories.premium.slug),
      pod: printOnDemandCatalogFixtures.categories.premium.range
    });
    const standard = await insertCategory({
      db,
      name: uniqueName('Standard Category'),
      slug: uniqueSlug('standard-category')
    });

    const simpleOutOfStock = await insertProduct({
      db,
      name: uniqueName(printOnDemandCatalogFixtures.products.simpleOutOfStock.name),
      slug: uniqueSlug(printOnDemandCatalogFixtures.products.simpleOutOfStock.sku),
      sku: uniqueSku(printOnDemandCatalogFixtures.products.simpleOutOfStock.sku),
      categoryId: simple.id,
      price: 129.9,
      qty: 0,
      manageStock: true,
      stockAvailability: true
    });
    const complexOutOfStock = await insertProduct({
      db,
      name: uniqueName(printOnDemandCatalogFixtures.products.complexOutOfStock.name),
      slug: uniqueSlug(printOnDemandCatalogFixtures.products.complexOutOfStock.sku),
      sku: uniqueSku(printOnDemandCatalogFixtures.products.complexOutOfStock.sku),
      categoryId: complex.id,
      price: 149.9,
      qty: 0,
      manageStock: true,
      stockAvailability: true
    });
    const premiumOutOfStock = await insertProduct({
      db,
      name: uniqueName(printOnDemandCatalogFixtures.products.premiumOutOfStock.name),
      slug: uniqueSlug(printOnDemandCatalogFixtures.products.premiumOutOfStock.sku),
      sku: uniqueSku(printOnDemandCatalogFixtures.products.premiumOutOfStock.sku),
      categoryId: premium.id,
      price: 169.9,
      qty: 0,
      manageStock: true,
      stockAvailability: true
    });
    const simpleInStock = await insertProduct({
      db,
      name: uniqueName('POD Product In Stock'),
      slug: uniqueSlug('pod-product-in-stock'),
      sku: uniqueSku('pod-product-in-stock'),
      categoryId: simple.id,
      price: 139.9,
      qty: 8,
      manageStock: true,
      stockAvailability: true
    });
    const standardOutOfStock = await insertProduct({
      db,
      name: uniqueName('Standard Out Of Stock Product'),
      slug: uniqueSlug('standard-out-of-stock-product'),
      sku: uniqueSku('standard-out-of-stock-product'),
      categoryId: standard.id,
      price: 89.9,
      qty: 0,
      manageStock: true,
      stockAvailability: true
    });

    const catalog = {
      categories: {
        simple,
        complex,
        premium,
        standard
      },
      products: {
        simpleOutOfStock,
        complexOutOfStock,
        premiumOutOfStock,
        simpleInStock,
        standardOutOfStock
      },
      searchKeyword: suffix
    };

    await warmSeededCatalogStorefront(catalog);
    return catalog;
  } finally {
    await db.end();
  }
}

export async function findCategoryUuidByName(name: string): Promise<string> {
  const db = createDbPool();

  try {
    const result = await db.query(
      `
        SELECT c.uuid
        FROM category c
        INNER JOIN category_description cd
          ON cd.category_description_category_id = c.category_id
        WHERE cd.name = $1
        ORDER BY c.category_id DESC
        LIMIT 1
      `,
      [name]
    );

    if (result.rows.length === 0) {
      throw new Error(`Category not found for name: ${name}`);
    }

    return result.rows[0].uuid as string;
  } finally {
    await db.end();
  }
}

export async function waitForCategoryUuidByName(
  name: string,
  timeoutMs = 15000
): Promise<string> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      return await findCategoryUuidByName(name);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Timed out waiting for category: ${name}`);
}

export async function loginToAdmin(page: Page) {
  await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Parola').fill(adminPassword);
  await page.getByRole('button', { name: /Sign In|Autentificare/i }).click();
  await expect(page).toHaveURL(/\/admin(?:\/dashboard)?(?:\?.*)?$/, {
    timeout: 30000
  });
}

export async function dismissCookieBanner(page: Page) {
  const rejectOptionalCookies = page.getByRole('button', {
    name: /Respinge cookie-urile neesențiale|Reject non-essential cookies/i
  });

  if ((await rejectOptionalCookies.count()) === 0) {
    return;
  }

  const cookieRegion = page.getByRole('region', { name: /Preferințe cookie|Cookie/i });
  if (!(await cookieRegion.isVisible().catch(() => false))) {
    return;
  }

  await rejectOptionalCookies.click();
  await expect(cookieRegion).toBeHidden({ timeout: 15000 });
}

export async function seedRejectedCookieConsent(page: Page) {
  const consentRecord = {
    version: 2,
    status: 'rejected_non_essential',
    categories: {
      essential: true,
      preferences: false,
      analytics: false,
      adMeasurement: false,
      personalizedAds: false
    },
    updatedAt: new Date().toISOString()
  };

  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: cookieConsentStorageKey, value: consentRecord }
  );

  if (page.url().startsWith('http://') || page.url().startsWith('https://')) {
    await page.evaluate(
      ({ key, value }) => {
        window.localStorage.setItem(key, JSON.stringify(value));
      },
      { key: cookieConsentStorageKey, value: consentRecord }
    );
  }
}

export async function chooseSelectOption(
  page: Page,
  label: RegExp,
  preferredOption?: RegExp
) {
  const trigger = page.getByLabel(label);
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const listbox = page.getByRole('listbox').last();
  await expect(listbox).toBeVisible();

  if (preferredOption) {
    const preferred = listbox.getByRole('option', { name: preferredOption }).first();
    if ((await preferred.count()) > 0) {
      await preferred.click();
      await expect(listbox).toBeHidden({ timeout: 15000 });
      return;
    }
  }

  await listbox.locator('[role="option"]:not([aria-disabled="true"])').first().click();
  await expect(listbox).toBeHidden({ timeout: 15000 });
}

export async function completeGuestCheckout(
  page: Page,
  email = `pod-checkout-${Date.now()}@printel.local`
) {
  await dismissCookieBanner(page);
  await page.getByLabel(/Email/i).fill(email);
  await page.locator('[name="shippingAddress.full_name"]').fill('POD Playwright Customer');
  await page.locator('[name="shippingAddress.telephone"]').fill('+40721000000');
  await page.locator('[name="shippingAddress.address_1"]').fill('Strada Tiparului 10');
  await page.locator('[name="shippingAddress.city"]').fill('Bucuresti');
  await chooseSelectOption(page, /Country|Țară/i, /Romania|România/i);
  await chooseSelectOption(page, /Province|Județ/i, /Bucuresti|București|Bucharest/i);
  await page.locator('[name="shippingAddress.postcode"]').fill('010101');

  const shippingMethod = page.getByRole('radio', { name: /Playwright Flat Rate/i }).first();
  await expect(shippingMethod).toBeVisible({ timeout: 15000 });
  await expect(shippingMethod).toBeEnabled({ timeout: 15000 });
  await shippingMethod.click();
  await expect(shippingMethod).toHaveAttribute('aria-checked', 'true');

  const paymentMethod = page.getByRole('radio', { name: /Cash on Delivery/i }).first();
  await expect(paymentMethod).toBeVisible({ timeout: 15000 });
  await expect(paymentMethod).toBeEnabled({ timeout: 15000 });
  await paymentMethod.click();
  await expect(paymentMethod).toHaveAttribute('aria-checked', 'true');

  await page
    .getByRole('button', { name: /Place Order|Complete Order|Finalizează comanda/i })
    .click();
  await expect(page.getByText(/Order #|Thank you|Mulțumim/i).first()).toBeVisible({
    timeout: 30000
  });
}
