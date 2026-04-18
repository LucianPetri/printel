import assert from 'node:assert/strict';
import test from 'node:test';

import legalFooterResolvers from '../../extensions/printelLegalFooter/dist/graphql/types/LegalFooterSetting/LegalFooterSetting.resolvers.js';

test('legal footer resolvers return configured company fields', () => {
  const setting = [
    { name: 'companyLegalName', value: 'PRINTEL MEDIA SRL' },
    { name: 'companyLegalForm', value: 'SRL' },
    { name: 'companyTaxId', value: 'RO12345678' },
    { name: 'companyTradeRegister', value: 'J40/1234/2024' },
    { name: 'companyRegisteredOffice', value: 'Bucharest' },
    { name: 'companyContactEmail', value: 'legal@printel.ro' },
    { name: 'companyContactPhone', value: '+40 700 000 000' }
  ];

  assert.equal(legalFooterResolvers.Setting.companyLegalName(setting), 'PRINTEL MEDIA SRL');
  assert.equal(legalFooterResolvers.Setting.companyLegalForm(setting), 'SRL');
  assert.equal(legalFooterResolvers.Setting.companyTaxId(setting), 'RO12345678');
  assert.equal(
    legalFooterResolvers.Setting.companyTradeRegister(setting),
    'J40/1234/2024'
  );
  assert.equal(legalFooterResolvers.Setting.companyRegisteredOffice(setting), 'Bucharest');
  assert.equal(legalFooterResolvers.Setting.companyContactEmail(setting), 'legal@printel.ro');
  assert.equal(
    legalFooterResolvers.Setting.companyContactPhone(setting),
    '+40 700 000 000'
  );
});

test('legal footer resolvers return null for absent values', () => {
  const setting = [{ name: 'companyLegalName', value: '' }];

  assert.equal(legalFooterResolvers.Setting.companyLegalName(setting), null);
  assert.equal(legalFooterResolvers.Setting.companyContactEmail(setting), null);
});