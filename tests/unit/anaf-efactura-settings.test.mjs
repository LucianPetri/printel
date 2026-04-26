import assert from 'node:assert/strict';
import test from 'node:test';

import { ANAF_ENVIRONMENTS, ANAF_SUBMISSION_MODES } from '../../extensions/printelAnafEfactura/dist/lib/anafStatuses.js';

test('supported ANAF environments remain sandbox and live', () => {
  assert.deepEqual(ANAF_ENVIRONMENTS, ['test', 'prod']);
});

test('supported submission modes remain automatic and manual', () => {
  assert.deepEqual(ANAF_SUBMISSION_MODES, ['automatic', 'manual']);
});
