import assert from 'node:assert/strict';
import test from 'node:test';

import { getAnafStatusMeta, getNextRetryAt } from '../../extensions/printelAnafEfactura/dist/lib/anafStatuses.js';

test('automatic flow backoff starts with a 5 minute retry window', () => {
  const now = new Date('2026-04-25T10:00:00.000Z');
  const retryAt = getNextRetryAt(0, now);
  assert.equal(retryAt.toISOString(), '2026-04-25T10:05:00.000Z');
});

test('registered ANAF state maps to success badge metadata', () => {
  assert.deepEqual(getAnafStatusMeta('registered'), {
    badge: 'success',
    label: 'Registered'
  });
});
