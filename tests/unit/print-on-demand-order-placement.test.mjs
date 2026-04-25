import assert from 'node:assert/strict';
import test from 'node:test';

import {
  shouldSkipPrintOnDemandStockDecrement
} from '../../extensions/printelPrintOnDemand/dist/lib/printOnDemandPresentation.js';
import {
  podCategories,
  podProducts
} from './fixtures/print-on-demand-category-fixtures.mjs';

test('shouldSkipPrintOnDemandStockDecrement returns true for eligible out-of-stock pod items', () => {
  assert.equal(
    shouldSkipPrintOnDemandStockDecrement(
      podProducts.simpleOutOfStock,
      podCategories.simple
    ),
    true
  );
});

test('shouldSkipPrintOnDemandStockDecrement preserves normal stock behavior otherwise', () => {
  assert.equal(
    shouldSkipPrintOnDemandStockDecrement(
      podProducts.simpleInStock,
      podCategories.simple
    ),
    false
  );

  assert.equal(
    shouldSkipPrintOnDemandStockDecrement(
      podProducts.standardOutOfStock,
      podCategories.standard
    ),
    false
  );
});
