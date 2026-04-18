import { expect, test } from '@playwright/test';

const cookieBannerData = {
  title: 'Confidențialitatea ta, tratată cu grijă.',
  message:
    'Folosim cookie-uri esențiale pentru funcționarea și securitatea magazinului. Cu acordul tău, putem activa și cookie-uri de preferințe, analiză, măsurare publicitară și reclame personalizate.',
  policyUrl: '/page/politica-cookie-uri',
  policyLabel: 'Politica de cookie-uri'
};

test.describe('Cookie banner', () => {
  test('storefront shows the banner and persists consent choices', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    await expect(page.getByText(cookieBannerData.title)).toBeVisible();
    await expect(page.getByText(cookieBannerData.message)).toBeVisible();
    await expect(page.getByRole('link', { name: cookieBannerData.policyLabel })).toHaveAttribute(
      'href',
      cookieBannerData.policyUrl
    );

    await page.goto(cookieBannerData.policyUrl);
    await expect(page.locator('h1', { hasText: 'Politica de cookie-uri' })).toBeVisible();
    await expect(page.getByText(/servicii precum Google AdSense/i)).toBeVisible();
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    await page.getByTestId('customize-cookies').click();
    await expect(page.getByText('Cookie-uri de preferințe', { exact: true })).toBeVisible();
    await expect(page.getByText('Cookie-uri de analiză', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Cookie-uri de publicitate și măsurare', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText('Cookie-uri pentru reclame personalizate', { exact: true })
    ).toBeVisible();
    await page.getByTestId('customize-cookies').click();

    await page.getByTestId('reject-non-essential-cookies').click();
    await expect(page.getByTestId('cookie-banner')).toBeHidden();
    await expect(page.getByTestId('manage-cookies-button')).toBeVisible();

    const rejectedConsent = await page.evaluate(() =>
      window.localStorage.getItem('printel_cookie_consent_v1')
    );
    expect(rejectedConsent).toContain('rejected_non_essential');

    await page.getByTestId('manage-cookies-button').click();
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    await page.getByTestId('toggle-analytics-cookies').click();
    await page.getByTestId('toggle-adMeasurement-cookies').click();
    await page.getByTestId('save-cookie-preferences').click();

    const customizedConsent = await page.evaluate(() =>
      window.localStorage.getItem('printel_cookie_consent_v1')
    );
    expect(customizedConsent).toContain('customized');
    expect(customizedConsent).toContain('"analytics":true');
    expect(customizedConsent).toContain('"adMeasurement":true');
    expect(customizedConsent).toContain('"personalizedAds":false');
    await expect(page.getByTestId('manage-cookies-button')).toBeVisible();
  });
});