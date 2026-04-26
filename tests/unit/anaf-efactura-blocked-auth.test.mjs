import assert from 'node:assert/strict';
import test from 'node:test';

import { submitInvoiceToAnaf } from '../../extensions/printelAnafEfactura/dist/lib/tsAnafClient.js';
import { anafConnectionStateFixture } from './fixtures/anaf-efactura-fixtures.mjs';

test('blocked authentication outcome is returned when simulation mode forces auth failure', async () => {
  const previousMode = process.env.ANAF_SIMULATION_MODE;
  process.env.ANAF_SIMULATION_MODE = 'auth';

  const result = await submitInvoiceToAnaf({
    invoiceXml: '<Invoice />',
    invoiceHash: 'hash-1',
    environment: 'test',
    connectionState: anafConnectionStateFixture
  });

  assert.equal(result.outcome, 'blocked_auth');
  assert.equal(result.failureCode, 'auth_failed');

  process.env.ANAF_SIMULATION_MODE = previousMode;
});
