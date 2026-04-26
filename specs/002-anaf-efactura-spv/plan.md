# Implementation Plan: Romanian ANAF e-Factura / SPV Order Integration

**Branch**: `002-anaf-efactura-spv` | **Date**: 2026-04-25 | **Spec**: `/home/xaiko/apps/printel/specs/002-anaf-efactura-spv/spec.md`
**Input**: Feature specification from `/home/xaiko/apps/printel/specs/002-anaf-efactura-spv/spec.md`

## Summary

Implement a new EverShop extension that owns ANAF e-Factura/SPV connectivity, invoice generation/submission, retry orchestration, manual approval, and delayed order-confirmation release for all orders. The design keeps checkout acceptance independent from ANAF uptime, uses `ts-anaf` as the integration adapter, stores immutable compliance snapshots per order, and replaces the default immediate order-confirmation flow with an ANAF-gated sender.

## Technical Context

**Language/Version**: Node.js ESM, TypeScript 6, React admin components, EverShop 2.1.2  
**Primary Dependencies**: `@evershop/evershop`, `@florinszilagyi/anaf-ts-sdk`, PostgreSQL, Playwright, Node test runner  
**Storage**: Existing `setting` table for non-secret store config; new PostgreSQL tables for secure ANAF connection state, order compliance state, and submission attempts  
**Testing**: `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run build`  
**Target Platform**: Linux-hosted EverShop app + EverShop cron worker + PostgreSQL  
**Project Type**: EverShop extension-based ecommerce web app  
**Performance Goals**:
- Order placement must still succeed when ANAF is slow/down
- Automatic-mode inline ANAF attempt must be time-bounded (target <= 5s before queue fallback)
- Retry worker must be idempotent and safe under duplicate execution
**Constraints**:
- Never send normal confirmation email before ANAF success
- Never lose accepted orders because ANAF is unavailable
- One confirmation email max per order
- Romanian/localized admin + customer copy
- Secrets must not live in committed config or plaintext settings rows
**Scale/Scope**: All customer orders, one active ANAF legal entity/profile for first release

## Constitution Check

- [x] Extension-first scope identified: `config/default.json`, new `extensions/printelAnafEfactura`, generated `dist/`, `translations/en`, `translations/ro`, `tests/unit`, `tests/e2e`
- [x] Romanian/compliance impact reviewed: legal company data, ANAF guidance, customer email wording, sandbox/live warnings
- [x] `src` to `dist` compile path identified: new workspace added to `build:extensions` and `typecheck`
- [x] Validation commands listed using repository entry points
- [x] Config/secret handling documented: non-secret UI config in settings; OAuth/app secrets in env; refresh tokens encrypted at rest

## Project Structure

### Documentation (this feature)

```text
specs/002-anaf-efactura-spv/
├── plan.md
├── checklists/
│   ├── anaf.md
│   └── requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
config/
└── default.json

extensions/
└── printelAnafEfactura/
    ├── src/
    │   ├── bootstrap.ts
    │   ├── migration/
    │   ├── lib/
    │   │   ├── anaf/
    │   │   ├── email/
    │   │   ├── queue/
    │   │   └── compliance/
    │   ├── subscribers/
    │   │   ├── order_placed/
    │   │   └── order_status_updated/
    │   ├── crons/
    │   ├── api/admin/
    │   ├── graphql/
    │   └── pages/admin/
    ├── dist/
    ├── package.json
    └── tsconfig.json

tests/
├── unit/
│   └── anaf-*.test.mjs
└── e2e/
    └── anaf-*.spec.ts

translations/
├── ro/messages.json
└── en/messages.json

scripts/
└── run-anaf-retry-worker.mjs
```

**Structure Decision**: Add a dedicated `printelAnafEfactura` EverShop workspace so ANAF integration, compliance state, admin surfaces, retry orchestration, and delayed email release stay isolated from existing theme/footer/cookie extensions and from core package code.

## Architecture

### 1. Extension ownership

Create `printelAnafEfactura` instead of modifying core or unrelated workspaces. It will:
- register cron jobs
- expose admin APIs/pages
- extend GraphQL types for settings/order views
- subscribe to `order_placed` and `order_status_updated`
- send the delayed confirmation email after ANAF success

### 2. ANAF gateway layer

Wrap `ts-anaf` behind a local adapter:
- `UblBuilder` for invoice XML
- `validateXml`
- `uploadDocument`
- `getUploadStatus`
- `downloadDocument`
- token refresh/auth handling

This isolates Printel business rules from SDK details and makes unit testing easier.

### 3. Order lifecycle

On `order_placed`:
1. Build immutable invoice snapshot from order + address + existing legal/store settings
2. Create `order_anaf_compliance` row
3. If mode = `manual`, mark `pending_approval`
4. If mode = `automatic`, try immediate bounded submission
5. If ANAF is unavailable/slow, mark `queued`
6. Do **not** send confirmation email
7. On eventual ANAF success, persist registration code and send confirmation once

### 4. Retry/background processing

Use EverShop cron registration with a DB-backed queue:
- poll due rows by `next_retry_at`
- use row locking / idempotent state transitions
- distinguish transient outage vs auth/config/validation failure
- exponential backoff with max-attempt threshold
- move to `attention_required` after repeated failures
- move to `manual_review` on canceled/materially changed orders

### 5. Email release coordination

Replace the default immediate confirmation flow:
- disable/use bypass of core `order_placed` confirmation path at rollout
- send confirmation only from ANAF success handler
- reuse existing order-confirmation content shape, but append ANAF registration code
- protect with `email_released_at IS NULL` guard

## Integration Decisions

| Topic | Decision | Why | Alternative Rejected |
|---|---|---|---|
| ANAF integration | Use `ts-anaf` SDK | Already covers auth, UBL, upload, status, download, sandbox | Raw HTTP adds legal/integration risk |
| Config location | Non-secrets in settings; secrets in env; tokens encrypted in DB | Matches repo constitution and operational safety | Plaintext `setting` rows for tokens/secrets |
| Compliance state | Dedicated tables, not `order.status` | Avoids breaking OMS payment/shipment logic | Overloading core order status |
| Retry model | DB queue + EverShop cron | Fits current platform, no external worker dependency | External queue infra is unnecessary for v1 |
| Email release | Custom delayed sender after ANAF success | Required by spec; exactly-once control | Sending normal core email at `order_placed` |

## Data Model

### Store-level config

Use existing store/legal settings as source where possible:
- `storeName`, `storeEmail`, store address fields
- `companyLegalName`, `companyTaxId`, `companyTradeRegister`, `companyRegisteredOffice`

Add non-secret settings keys:
- `anafEnvironment` (`test` | `prod`)
- `anafSubmissionMode` (`automatic` | `manual`)
- `anafEnabled` (rollout safety)
- optional display-only metadata: `anafLastConnectionCheckAt`, `anafConnectionLabel`

### New secure table: `anaf_connection_state`

- `anaf_connection_state_id`
- `company_tax_id`
- `environment`
- `encrypted_refresh_token`
- `token_expires_at`
- `connected_by_admin_user_id`
- `connected_at`
- `last_verified_at`
- `last_error_code`
- `last_error_message`
- `is_connected`
- `last_disconnect_reason`
- timestamps

### New order table: `order_anaf_compliance`

- `order_id` (unique FK)
- `environment`
- `submission_mode`
- `status` (`pending_approval`, `queued`, `submitting`, `registered`, `attention_required`, `manual_review`, `blocked_auth`)
- `invoice_number`
- `invoice_hash`
- `invoice_xml`
- `upload_index`
- `download_id`
- `registration_code`
- `latest_failure_code`
- `latest_failure_message`
- `retry_count`
- `next_retry_at`
- `approved_by_admin_user_id`
- `approved_at`
- `email_released_at`
- `manual_review_reason`
- timestamps

### New attempt table: `order_anaf_attempt`

- `order_anaf_attempt_id`
- `order_id`
- `triggered_by` (`auto`, `manual_approval`, `retry_cron`, `admin_retry`, `reconcile`)
- `admin_user_id`
- `status`
- `request_hash`
- `response_payload`
- `started_at`
- `finished_at`

## State Model

```text
manual mode:
order_placed -> pending_approval -> queued -> submitting -> registered
                                      \-> attention_required
                                      \-> blocked_auth

automatic mode:
order_placed -> submitting -> registered
                        \-> queued -> submitting -> registered
                        \-> attention_required
                        \-> blocked_auth

special transitions:
queued/submitting + cancel/change -> manual_review
duplicate/already registered -> registered (no second email)
registered -> terminal; immutable compliance record retained
```

Material-change detection must cover at least:
- order cancellation
- billing identity changes
- company or tax identity changes
- store legal-entity changes
- currency changes
- order-level price or tax-total changes
- line-item additions or removals
- line-item quantity changes

## Admin UX

### Store settings

Inject a new ANAF section into `storeInfoSetting` with:
- environment selector with strong sandbox/live badge
- submission mode selector
- legal entity summary pulled from existing legal/store settings
- connection health card
- “Connect / Reconnect / Disconnect” actions
- guidance for OAuth + certificate flow, renewal expectations, and test-vs-live differences

### Order admin

Add:
- ANAF status badge/column in order grid
- ANAF panel on order detail with:
  - current state
  - registration code
  - attempt history
  - latest failure
  - next retry time
  - approve/retry actions
  - manual review banner

## Contracts

### Admin API routes

- `POST /api/anaf/connect/start`
- `GET /api/anaf/connect/callback`
- `POST /api/anaf/disconnect`
- `POST /api/orders/:uuid/anaf/approve`
- `POST /api/orders/:uuid/anaf/retry`
- `GET /api/orders/:uuid/anaf/status`

### GraphQL additions

- `Setting.anafEnvironment`
- `Setting.anafSubmissionMode`
- `Setting.anafConnectionState`
- `Order.anafCompliance`
- optional admin queue/filter fields for pending approvals and attention-required items

## Background Processing Rules

- Immediate automatic submission is best-effort and time-capped
- Retry worker runs on an explicitly registered EverShop cron schedule (default every 5 minutes)
- Backoff policy: 5m, 15m, 30m, 60m, then 6h cap
- Max automatic retries: 5 failed attempts before `attention_required`
- Auth/config errors stop silent retries and move to visible `blocked_auth`
- Canceled or materially changed queued orders move to `manual_review`
- Use immutable `invoice_hash` to keep retries idempotent
- Every manual approval and admin-triggered retry must persist the acting admin user in the attempt log

## Email Strategy

- Preserve the existing “normal order confirmation” concept
- Extension sends it only after `registered`
- Add ANAF registration code to template data
- Guard on `email_released_at` to enforce exactly-once
- No alternate customer email may imply ANAF success before success actually exists

## Testing Strategy

### Unit

- invoice snapshot mapper
- UBL builder adapter inputs
- retry scheduling/backoff
- duplicate/already-registered reconciliation
- exactly-once email release guard
- token encryption/decryption
- admin config validation and connection-state mapping

### Integration/unit with fakes

Mock `AnafGateway` to simulate:
- success
- transient outage
- delayed processing
- auth failure
- duplicate/already-registered response

### E2E (Playwright)

Cover:
- admin settings persistence + guidance
- automatic flow: place order, withhold email until success, then release once
- manual mode: order pending until admin approval
- outage flow: order accepted, queued, later success releases email
- repeated retry/duplicate flow: still one email
- canceled queued order -> manual review visible

### Sandbox validation using `ts-anaf`

Before production activation, run supervised ANAF test-environment scenarios with real sandbox credentials:
- automatic submission
- manual approval
- outage/retry recovery
- invalid auth handling
- duplicate-response reconciliation
- delayed email release behavior

This sandbox suite should be env-gated, not default CI.

## Deployment / Rollout

1. Add workspace to `package.json` build/typecheck chain
2. Register extension in `config/default.json`
3. Add migrations for new tables
4. Add env vars:
   - `ANAF_CLIENT_ID`
   - `ANAF_CLIENT_SECRET`
   - `ANAF_REDIRECT_URI`
   - `ANAF_TOKEN_ENCRYPTION_KEY`
   - optional `ANAF_QUEUE_CRON`
5. Deploy with `anafEnabled=false` initially, while preserving the current immediate confirmation behavior until the ANAF-gated confirmation flow is explicitly enabled
6. Connect in sandbox, complete end-to-end tests
7. Switch to live env only after explicit approval
8. Monitor queue depth, attention-required count, and delayed-email backlog

## Primary Risks

- **OAuth/certificate operational complexity** -> mitigate with admin guidance + health panel
- **ANAF delayed/duplicate behavior** -> mitigate with upload index persistence + reconcile logic
- **Secret exposure** -> mitigate by avoiding plaintext settings for secrets/tokens
- **Email deadlock if connection breaks** -> mitigate with strong admin alerts and queue visibility
- **OMS coupling** -> mitigate by keeping ANAF state separate from core order status

## Planned Phase Outputs

- `data-model.md`: tables/state machine above
- `contracts/`: admin API + GraphQL extensions
- `quickstart.md`: sandbox setup, connect flow, approval/retry operator runbook

Post-design constitution check: **PASS**.
