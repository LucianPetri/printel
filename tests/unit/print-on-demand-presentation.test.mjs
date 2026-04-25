import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatPrintOnDemandRangeLabel,
  resolvePrintOnDemandPresentation
} from '../../extensions/printelPrintOnDemand/dist/lib/printOnDemandPresentation.js';
import {
  podCategories,
  podProducts
} from './fixtures/print-on-demand-category-fixtures.mjs';

test('resolvePrintOnDemandPresentation applies pod messaging to eligible out-of-stock products', () => {
  const presentation = resolvePrintOnDemandPresentation(
    podProducts.simpleOutOfStock,
    podCategories.simple
  );

  assert.equal(presentation.applies, true);
  assert.equal(presentation.purchasable, true);
  assert.equal(presentation.ctaLabel, 'Print Now');
  assert.equal(presentation.sourceCategoryId, podCategories.simple.category_id);
  assert.deepEqual(presentation.deliveryRange, {
    min: 5,
    max: 7,
    unit: 'days',
    label: 'Print-on-demand delivery: 5-7 days'
  });
});

test('resolvePrintOnDemandPresentation keeps distinct ranges for multiple pod categories', () => {
  const simplePresentation = resolvePrintOnDemandPresentation(
    podProducts.simpleOutOfStock,
    podCategories.simple
  );
  const complexPresentation = resolvePrintOnDemandPresentation(
    podProducts.complexOutOfStock,
    podCategories.complex
  );
  const premiumPresentation = resolvePrintOnDemandPresentation(
    podProducts.premiumOutOfStock,
    podCategories.premium
  );

  assert.equal(simplePresentation.deliveryRange.label, 'Print-on-demand delivery: 5-7 days');
  assert.equal(complexPresentation.deliveryRange.label, 'Print-on-demand delivery: 2-3 weeks');
  assert.equal(premiumPresentation.deliveryRange.label, 'Print-on-demand delivery: 4 weeks');
});

test('formatPrintOnDemandRangeLabel collapses equal ranges to a single value', () => {
  assert.equal(
    formatPrintOnDemandRangeLabel({
      min: 1,
      max: 1,
      unit: 'weeks'
    }),
    'Print-on-demand delivery: 1 week'
  );

  assert.equal(
    formatPrintOnDemandRangeLabel({
      min: 4,
      max: 4,
      unit: 'weeks'
    }),
    'Print-on-demand delivery: 4 weeks'
  );
});
