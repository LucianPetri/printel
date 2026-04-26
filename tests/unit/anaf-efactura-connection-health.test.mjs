import assert from 'node:assert/strict';
import test from 'node:test';

import { checkAnafConnection } from '../../extensions/printelAnafEfactura/dist/lib/tsAnafClient.js';
import {
  decryptAnafToken,
  encryptAnafToken
} from '../../extensions/printelAnafEfactura/dist/lib/tokenCipher.js';
import { anafConnectionStateFixture } from './fixtures/anaf-efactura-fixtures.mjs';

test('connection health fails when the secure refresh token is missing', async () => {
  const result = await checkAnafConnection({
    environment: 'test',
    connectionState: null
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, 'missing_connection');
});

test('connection health reports connected when a token is stored', async () => {
  const previousMode = process.env.ANAF_SIMULATION_MODE;
  process.env.ANAF_SIMULATION_MODE = 'success';

  const result = await checkAnafConnection({
    environment: 'test',
    connectionState: anafConnectionStateFixture
  });

  assert.equal(result.ok, true);
  assert.equal(result.code, 'connected');

  process.env.ANAF_SIMULATION_MODE = previousMode;
});

test('token cipher encrypts and decrypts refresh tokens with the configured key', () => {
  const previousKey = process.env.ANAF_TOKEN_ENCRYPTION_KEY;
  process.env.ANAF_TOKEN_ENCRYPTION_KEY = 'unit-test-anaf-key';

  const encrypted = encryptAnafToken('refresh-token-demo');

  assert.notEqual(encrypted, 'refresh-token-demo');
  assert.equal(decryptAnafToken(encrypted), 'refresh-token-demo');

  process.env.ANAF_TOKEN_ENCRYPTION_KEY = previousKey;
});

test('token cipher fails fast when the encryption key is missing', () => {
  const previousKey = process.env.ANAF_TOKEN_ENCRYPTION_KEY;
  delete process.env.ANAF_TOKEN_ENCRYPTION_KEY;

  assert.throws(() => encryptAnafToken('refresh-token-demo'), {
    message: /ANAF_TOKEN_ENCRYPTION_KEY must be configured/i
  });

  process.env.ANAF_TOKEN_ENCRYPTION_KEY = previousKey;
});
