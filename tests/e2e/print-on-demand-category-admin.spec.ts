import { expect, Page, test } from '@playwright/test';
import {
  chooseSelectOption,
  loginToAdmin,
  waitForCategoryUuidByName
} from './helpers/print-on-demand.js';

test.describe.serial('Print-on-demand category admin', () => {
  test.describe.configure({ timeout: 120000 });

  async function fillRequiredSeoFields(page: Page, value: string) {
    await page.getByLabel(/URL key/i).fill(value);
    await page.getByLabel(/Meta title/i).fill(value);
    await page.getByLabel(/Meta description/i).fill(value);
  }

  test('admins can save and reopen multiple POD categories', async ({ page }) => {
    const suffix = Date.now().toString(36);
    const categoryAName = `POD Admin Category A ${suffix}`;
    const categoryBName = `POD Admin Category B ${suffix}`;

    await loginToAdmin(page);

    await page.goto('/admin/categories/new', { waitUntil: 'domcontentloaded' });
    await page.getByLabel(/Category Name/i).fill(categoryAName);
    await page.getByRole('switch', { name: /Enable print on demand/i }).click();
    await page.locator('[name="print_on_demand_min"]').fill('5');
    await page.locator('[name="print_on_demand_max"]').fill('7');
    await chooseSelectOption(page, /Delivery time unit/i, /Days/i);
    await fillRequiredSeoFields(page, `pod-admin-category-a-${suffix}`);
    await page.getByRole('button', { name: /Save|Salvează/i }).click();
    const categoryAUuid = await waitForCategoryUuidByName(categoryAName);
    const categoryAPage = await page.context().newPage();
    await categoryAPage.goto(`/admin/categories/edit/${categoryAUuid}`, {
      waitUntil: 'domcontentloaded'
    });

    await expect(categoryAPage.getByLabel(/Category Name/i)).toHaveValue(categoryAName);
    await expect(categoryAPage.locator('[name="print_on_demand_min"]')).toHaveValue('5');
    await expect(categoryAPage.locator('[name="print_on_demand_max"]')).toHaveValue('7');
    await expect(categoryAPage.getByLabel(/Delivery time unit/i)).toContainText(/Days/i);
    await categoryAPage.close();

    await page.goto('/admin/categories/new', { waitUntil: 'domcontentloaded' });
    await page.getByLabel(/Category Name/i).fill(categoryBName);
    await page.getByRole('switch', { name: /Enable print on demand/i }).click();
    await page.locator('[name="print_on_demand_min"]').fill('2');
    await page.locator('[name="print_on_demand_max"]').fill('3');
    await chooseSelectOption(page, /Delivery time unit/i, /Weeks/i);
    await fillRequiredSeoFields(page, `pod-admin-category-b-${suffix}`);
    await page.getByRole('button', { name: /Save|Salvează/i }).click();
    const categoryBUuid = await waitForCategoryUuidByName(categoryBName);
    const categoryBPage = await page.context().newPage();
    await categoryBPage.goto(`/admin/categories/edit/${categoryBUuid}`, {
      waitUntil: 'domcontentloaded'
    });

    await expect(categoryBPage.getByLabel(/Category Name/i)).toHaveValue(categoryBName);
    await expect(categoryBPage.locator('[name="print_on_demand_min"]')).toHaveValue('2');
    await expect(categoryBPage.locator('[name="print_on_demand_max"]')).toHaveValue('3');
    await expect(categoryBPage.getByLabel(/Delivery time unit/i)).toContainText(/Weeks/i);
    await categoryBPage.close();
  });

  test('admins see localized validation for invalid POD ranges', async ({
    page
  }) => {
    const categoryName = `POD Invalid Category ${Date.now().toString(36)}`;

    await loginToAdmin(page);

    await page.goto('/admin/categories/new', { waitUntil: 'domcontentloaded' });
    await page.getByLabel(/Category Name/i).fill(categoryName);
    await page.getByRole('switch', { name: /Enable print on demand/i }).click();
    await page.locator('[name="print_on_demand_min"]').fill('8');
    await page.locator('[name="print_on_demand_max"]').fill('4');
    await chooseSelectOption(page, /Delivery time unit/i, /Days/i);
    await fillRequiredSeoFields(page, `pod-invalid-category-${Date.now().toString(36)}`);
    await page.getByRole('button', { name: /Save|Salvează/i }).click();

    await expect(
      page.getByText(/greater than or equal to the minimum/i)
    ).toBeVisible();

    await page.locator('[name="print_on_demand_max"]').fill('10');
    await page.locator('[name="print_on_demand_min"]').fill('');
    await page.getByRole('button', { name: /Save|Salvează/i }).click();

    await expect(page.getByText(/Minimum delivery time is required/i)).toBeVisible();
  });
});
