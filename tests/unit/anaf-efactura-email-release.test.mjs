import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getConnectionLabel,
  submitInvoiceToAnaf
} from '../../extensions/printelAnafEfactura/dist/lib/tsAnafClient.js';
import { anafConnectionStateFixture } from './fixtures/anaf-efactura-fixtures.mjs';

test('sandbox connection label is explicit', () => {
  assert.equal(getConnectionLabel('test', true), 'Connected to sandbox ANAF');
});

test('disconnected connection label is explicit', () => {
  assert.equal(getConnectionLabel('prod', false), 'Disconnected');
});

test('duplicate ANAF responses reconcile to a duplicate outcome with a registration code', async () => {
  const previousMode = process.env.ANAF_SIMULATION_MODE;
  process.env.ANAF_SIMULATION_MODE = 'duplicate';

  const result = await submitInvoiceToAnaf({
    invoiceXml: '<Invoice />',
    invoiceHash: 'duplicate-hash',
    environment: 'test',
    connectionState: anafConnectionStateFixture
  });

  assert.equal(result.outcome, 'duplicate');
  assert.ok(result.registrationCode);
  assert.ok(result.uploadIndex);

  process.env.ANAF_SIMULATION_MODE = previousMode;
});

test('delayed ANAF processing keeps the order queued for later retry', async () => {
  const previousMode = process.env.ANAF_SIMULATION_MODE;
  process.env.ANAF_SIMULATION_MODE = 'delayed';

  const result = await submitInvoiceToAnaf({
    invoiceXml: '<Invoice />',
    invoiceHash: 'delayed-hash',
    environment: 'test',
    connectionState: anafConnectionStateFixture
  });

  assert.equal(result.outcome, 'queued');
  assert.equal(result.failureCode, 'anaf_unavailable');

  process.env.ANAF_SIMULATION_MODE = previousMode;
});
