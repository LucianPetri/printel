import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAnafStatusMeta
} from '../../extensions/printelAnafEfactura/dist/lib/anafStatuses.js';
import { mapComplianceForAdmin } from '../../extensions/printelAnafEfactura/dist/lib/anafComplianceRepository.js';
import { anafComplianceFixture } from './fixtures/anaf-efactura-fixtures.mjs';

test('manual review mapper preserves failure metadata for admins', () => {
  const mapped = mapComplianceForAdmin(
    {
      ...anafComplianceFixture,
      status: 'manual_review',
      manual_review_reason: 'Order changed after queueing.'
    },
    []
  );

  assert.equal(mapped.status.code, 'manual_review');
  assert.equal(mapped.manualReviewReason, 'Order changed after queueing.');
});

test('manual review status keeps the warning badge metadata expected by admins', () => {
  assert.deepEqual(getAnafStatusMeta('manual_review'), {
    badge: 'warning',
    label: 'Manual review'
  });
});
