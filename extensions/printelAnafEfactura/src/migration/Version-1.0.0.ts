import { execute, insertOnUpdate } from '@evershop/postgres-query-builder';

const anafSettingKeys = [
  'anafEnabled',
  'anafEnvironment',
  'anafSubmissionMode',
  'anafLastConnectionCheckAt',
  'anafConnectionLabel'
];

export default async function migrate(connection: any) {
  await Promise.all(
    anafSettingKeys.map((name) =>
      insertOnUpdate('setting', ['name'])
        .given({
          name,
          value:
            name === 'anafEnvironment'
              ? 'test'
              : name === 'anafSubmissionMode'
                ? 'automatic'
                : '',
          is_json: 0
        })
        .execute(connection, false)
    )
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS anaf_connection_state (
      anaf_connection_state_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      company_tax_id TEXT,
      environment TEXT NOT NULL,
      encrypted_refresh_token TEXT,
      token_expires_at TIMESTAMP WITH TIME ZONE,
      connected_by_admin_user_id INT,
      connected_at TIMESTAMP WITH TIME ZONE,
      last_verified_at TIMESTAMP WITH TIME ZONE,
      last_error_code TEXT,
      last_error_message TEXT,
      is_connected BOOLEAN NOT NULL DEFAULT FALSE,
      last_disconnect_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS order_anaf_compliance (
      order_anaf_compliance_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      order_id INT NOT NULL UNIQUE,
      environment TEXT NOT NULL,
      submission_mode TEXT NOT NULL,
      status TEXT NOT NULL,
      invoice_number TEXT,
      invoice_hash TEXT,
      invoice_xml TEXT,
      upload_index TEXT,
      download_id TEXT,
      registration_code TEXT,
      latest_failure_code TEXT,
      latest_failure_message TEXT,
      retry_count INT NOT NULL DEFAULT 0,
      next_retry_at TIMESTAMP WITH TIME ZONE,
      approved_by_admin_user_id INT,
      approved_at TIMESTAMP WITH TIME ZONE,
      email_released_at TIMESTAMP WITH TIME ZONE,
      manual_review_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_order_anaf_compliance_order
        FOREIGN KEY (order_id) REFERENCES "order" (order_id) ON DELETE CASCADE
    );`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS order_anaf_attempt (
      order_anaf_attempt_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      order_id INT NOT NULL,
      triggered_by TEXT NOT NULL,
      admin_user_id INT,
      status TEXT NOT NULL,
      request_hash TEXT,
      response_payload TEXT,
      started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      finished_at TIMESTAMP WITH TIME ZONE,
      CONSTRAINT fk_order_anaf_attempt_order
        FOREIGN KEY (order_id) REFERENCES "order" (order_id) ON DELETE CASCADE
    );`
  );

  await execute(
    connection,
    `CREATE INDEX IF NOT EXISTS idx_order_anaf_compliance_status_retry
     ON order_anaf_compliance (status, next_retry_at);`
  );
}
