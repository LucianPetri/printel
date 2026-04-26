import assert from 'node:assert/strict';
import test from 'node:test';

import { getNextRetryAt } from '../../extensions/printelAnafEfactura/dist/lib/anafStatuses.js';

test('retry queue caps the backoff at six hours after the fifth failure', () => {
  const now = new Date('2026-04-25T10:00:00.000Z');
  const retryAt = getNextRetryAt(10, now);
  assert.equal(retryAt.toISOString(), '2026-04-25T16:00:00.000Z');
});
