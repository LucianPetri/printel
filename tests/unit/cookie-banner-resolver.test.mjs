import assert from 'node:assert/strict';
import test from 'node:test';

import cookieBannerResolvers from '../../extensions/printelCookieBanner/dist/graphql/types/CookieBannerSetting/CookieBannerSetting.resolvers.js';

test('cookie banner resolvers return trimmed string values when present', () => {
  const setting = [
    { name: 'cookieBannerTitle', value: 'Privacy first' },
    { name: 'cookieBannerMessage', value: 'Cookies keep the store working.' },
    { name: 'cookiePolicyUrl', value: '/page/cookies' },
    { name: 'cookiePolicyLinkLabel', value: 'Cookie Policy' }
  ];

  assert.equal(cookieBannerResolvers.Setting.cookieBannerTitle(setting), 'Privacy first');
  assert.equal(
    cookieBannerResolvers.Setting.cookieBannerMessage(setting),
    'Cookies keep the store working.'
  );
  assert.equal(cookieBannerResolvers.Setting.cookiePolicyUrl(setting), '/page/cookies');
  assert.equal(
    cookieBannerResolvers.Setting.cookiePolicyLinkLabel(setting),
    'Cookie Policy'
  );
});

test('cookie banner resolvers return null for missing or blank values', () => {
  const setting = [
    { name: 'cookieBannerTitle', value: '   ' },
    { name: 'cookieBannerMessage', value: null }
  ];

  assert.equal(cookieBannerResolvers.Setting.cookieBannerTitle(setting), null);
  assert.equal(cookieBannerResolvers.Setting.cookieBannerMessage(setting), null);
  assert.equal(cookieBannerResolvers.Setting.cookiePolicyUrl(setting), null);
});