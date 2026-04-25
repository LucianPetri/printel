import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getProductPrintOnDemandDisplay,
  resolvePrintOnDemandPresentation
} from '../../extensions/printelPrintOnDemand/dist/lib/printOnDemandPresentation.js';
import {
  podCategories,
  podProducts
} from './fixtures/print-on-demand-category-fixtures.mjs';

test('in-stock products in pod categories preserve normal storefront behavior', () => {
  const presentation = resolvePrintOnDemandPresentation(
    podProducts.simpleInStock,
    podCategories.simple
  );

  assert.equal(presentation.applies, false);
  assert.equal(presentation.purchasable, true);

  const display = getProductPrintOnDemandDisplay({
    ...podProducts.simpleInStock,
    inventory: { isInStock: true },
    printOnDemandPresentation: presentation
  });

  assert.equal(display.applies, false);
  assert.equal(display.ctaLabel, null);
  assert.equal(display.deliveryLabel, null);
});

test('non-pod out-of-stock products preserve sold-out behavior', () => {
  const presentation = resolvePrintOnDemandPresentation(
    podProducts.standardOutOfStock,
    podCategories.standard
  );

  assert.equal(presentation.applies, false);
  assert.equal(presentation.purchasable, false);
});
