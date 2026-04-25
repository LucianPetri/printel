import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPrintOnDemandPayload,
  normalizePrintOnDemandPolicy
} from '../../extensions/printelPrintOnDemand/dist/lib/printOnDemandPresentation.js';
import { podCategories } from './fixtures/print-on-demand-category-fixtures.mjs';

test('buildPrintOnDemandPayload keeps valid enabled payloads', () => {
  const result = buildPrintOnDemandPayload({
    print_on_demand_enabled: '1',
    print_on_demand_min: '5',
    print_on_demand_max: '7',
    print_on_demand_unit: 'days'
  });

  assert.deepEqual(result, {
    print_on_demand_enabled: true,
    print_on_demand_min: 5,
    print_on_demand_max: 7,
    print_on_demand_unit: 'days'
  });
});

test('buildPrintOnDemandPayload clears delivery values when disabled', () => {
  const result = buildPrintOnDemandPayload({
    print_on_demand_enabled: '0',
    print_on_demand_min: '2',
    print_on_demand_max: '3',
    print_on_demand_unit: 'weeks'
  });

  assert.equal(result.print_on_demand_enabled, false);
  assert.equal(result.print_on_demand_min, null);
  assert.equal(result.print_on_demand_max, null);
  assert.equal(result.print_on_demand_unit, null);
});

test('buildPrintOnDemandPayload rejects invalid enabled payloads', () => {
  assert.throws(
    () =>
      buildPrintOnDemandPayload({
        print_on_demand_enabled: true,
        print_on_demand_min: '8',
        print_on_demand_max: '4',
        print_on_demand_unit: 'days'
      }),
    /minimum cannot be greater than the maximum/i
  );

  assert.throws(
    () =>
      buildPrintOnDemandPayload({
        print_on_demand_enabled: true,
        print_on_demand_min: '0',
        print_on_demand_max: '4',
        print_on_demand_unit: 'days'
      }),
    /positive integers/i
  );
});

test('normalizePrintOnDemandPolicy returns a structured category policy', () => {
  const result = normalizePrintOnDemandPolicy(podCategories.simple);

  assert.deepEqual(result, {
    enabled: true,
    deliveryRange: {
      min: 5,
      max: 7,
      unit: 'days',
      label: undefined
    }
  });
});
