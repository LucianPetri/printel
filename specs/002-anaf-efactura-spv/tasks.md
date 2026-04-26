# Tasks: Romanian ANAF e-Factura / SPV Order Integration

**Input**: Design documents from `/specs/002-anaf-efactura-spv/`  
**Prerequisites**: `plan.md`, `spec.md`, `checklists/anaf.md`  
**Tests**: Required for this legally sensitive, money-related feature: `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run build`  
**Organization**: Tasks are grouped by user story for independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the dedicated EverShop extension and wire repository-level build/config entry points.

<!-- sequential -->
- [X] T001 Create the ANAF extension scaffold in `extensions/printelAnafEfactura/package.json`, `extensions/printelAnafEfactura/tsconfig.json`, and `extensions/printelAnafEfactura/src/bootstrap.ts`
<!-- sequential -->
- [X] T002 Add `ts-anaf` plus the new workspace compile/typecheck entries in `package.json`
<!-- sequential -->
- [X] T003 Register `printelAnafEfactura` and gate the ANAF-controlled confirmation flow in `config/default.json` and `config/production.json` so `anafEnabled=false` preserves the current immediate confirmation behavior

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schema, GraphQL, client, and extension wiring required before any user story work.

**⚠️ CRITICAL**: No user story work should start before this phase is complete.

<!-- sequential -->
- [X] T004 Add store-setting seeds plus `anaf_connection_state`, `order_anaf_compliance`, and `order_anaf_attempt` tables in `extensions/printelAnafEfactura/src/migration/Version-1.0.0.ts`

<!-- parallel-group: 1 -->
- [X] T005 [P] Add safe/public ANAF setting fields in `extensions/printelAnafEfactura/src/graphql/types/AnafSetting/AnafSetting.graphql` and secret/admin-only fields in `extensions/printelAnafEfactura/src/graphql/types/AnafSetting/AnafSetting.admin.graphql`
- [X] T006 [P] Add admin order compliance schema in `extensions/printelAnafEfactura/src/graphql/types/OrderAnafCompliance/OrderAnafCompliance.admin.graphql`
- [X] T007 [P] Define shared ANAF lifecycle constants in `extensions/printelAnafEfactura/src/lib/anafStatuses.ts`

<!-- parallel-group: 2 -->
- [X] T008 [P] Implement ANAF setting resolvers in `extensions/printelAnafEfactura/src/graphql/types/AnafSetting/AnafSetting.resolvers.ts`
- [X] T009 [P] Implement order compliance resolvers and query helpers in `extensions/printelAnafEfactura/src/graphql/types/OrderAnafCompliance/OrderAnafCompliance.admin.resolvers.ts`
- [X] T010 [P] Implement the `ts-anaf` wrapper and environment-aware auth client in `extensions/printelAnafEfactura/src/lib/tsAnafClient.ts`

<!-- sequential -->
- [X] T011 Implement invoice payload building and persistence helpers in `extensions/printelAnafEfactura/src/lib/buildAnafInvoicePayload.ts` and `extensions/printelAnafEfactura/src/lib/anafComplianceRepository.ts`
<!-- sequential -->
- [X] T012 Wire GraphQL, order-grid/detail extension points, delayed-email scaffolding hooks, and EverShop cron registration in `extensions/printelAnafEfactura/src/bootstrap.ts`
<!-- sequential -->
- [X] T013 Regenerate compiled foundational artifacts under `extensions/printelAnafEfactura/dist/`

**Checkpoint**: Foundation ready for story work.

---

## Phase 3: User Story 1 - Register an order with ANAF before customer confirmation (Priority: P1) 🎯 MVP

**Goal**: Accept the order, submit to ANAF in automatic mode, and send the normal confirmation exactly once only after ANAF success with the registration code included.

**Independent Test**: With valid ANAF sandbox connectivity and automatic mode enabled, place an order, verify immediate order acceptance, verify ANAF registration succeeds, and confirm one delayed order email includes the ANAF registration code.

### Tests for User Story 1

<!-- parallel-group: 3 -->
- [X] T014 [P] [US1] Add automatic-submission unit coverage in `tests/unit/anaf-efactura-automatic-flow.test.mjs`
- [X] T015 [P] [US1] Add delayed-email/idempotency unit coverage in `tests/unit/anaf-efactura-email-release.test.mjs`
- [X] T016 [P] [US1] Add automatic-mode checkout E2E coverage in `tests/e2e/anaf-efactura-automatic-flow.spec.ts`

### Implementation for User Story 1

<!-- parallel-group: 4 -->
- [X] T017 [P] [US1] Implement immediate ANAF submission on placed orders in `extensions/printelAnafEfactura/src/subscribers/order_placed/processAutomaticAnafSubmission.ts`
- [X] T018 [P] [US1] Implement duplicate-safe ANAF success reconciliation and delayed-processing status polling in `extensions/printelAnafEfactura/src/services/reconcileAnafSubmission.ts`
- [X] T019 [P] [US1] Implement delayed normal confirmation sending with ANAF code injection in `extensions/printelAnafEfactura/src/services/sendDelayedOrderConfirmation.ts`

<!-- sequential -->
- [X] T020 [US1] Wire the automatic path, one-time email guards, and order confirmation email data enrichment in `extensions/printelAnafEfactura/src/bootstrap.ts` and `extensions/printelAnafEfactura/src/lib/anafComplianceRepository.ts`
<!-- sequential -->
- [X] T021 [US1] Add ANAF success, duplicate-response, and delayed-email copy in `translations/ro/messages.json` and `translations/en/messages.json`
<!-- sequential -->
- [X] T022 [US1] Regenerate compiled User Story 1 artifacts under `extensions/printelAnafEfactura/dist/`

**Checkpoint**: US1 should be independently functional and testable.

---

## Phase 4: User Story 2 - Configure ANAF/SPV connection and submission policy (Priority: P2)

**Goal**: Give admins a safe configuration UI with guidance, connection health visibility, and a persisted automatic/manual submission policy.

**Independent Test**: Admin can save ANAF connection details, verify environment/mode visibility, read token/certificate guidance, switch to manual mode, and confirm new orders remain pending approval instead of auto-submitting.

### Tests for User Story 2

<!-- parallel-group: 5 -->
- [X] T023 [P] [US2] Add settings and submission-policy unit coverage in `tests/unit/anaf-efactura-settings.test.mjs`
- [X] T024 [P] [US2] Add connection-health and secret-masking unit coverage in `tests/unit/anaf-efactura-connection-health.test.mjs`
- [X] T025 [P] [US2] Add admin settings and manual-hold E2E coverage in `tests/e2e/anaf-efactura-admin-settings.spec.ts`

### Implementation for User Story 2

<!-- parallel-group: 6 -->
- [X] T026 [P] [US2] Implement the admin settings form and operator guidance in `extensions/printelAnafEfactura/src/pages/admin/storeSetting/AnafSettings.tsx`
- [X] T027 [P] [US2] Implement connect, callback, disconnect, and private connection-check endpoints in `extensions/printelAnafEfactura/src/api/anafConnectStart/route.json`, `extensions/printelAnafEfactura/src/api/anafConnectCallback/route.json`, `extensions/printelAnafEfactura/src/api/anafDisconnect/route.json`, and `extensions/printelAnafEfactura/src/api/anafConnectionCheck/checkConnection.ts`
- [X] T028 [P] [US2] Implement submission-policy resolution, approval authority checks, and manual-hold initialization in `extensions/printelAnafEfactura/src/services/resolveAnafSubmissionPolicy.ts` and `extensions/printelAnafEfactura/src/subscribers/order_placed/initializeAnafComplianceRecord.ts`

<!-- sequential -->
- [X] T029 [US2] Add order-level pending-approval visibility, approval attribution, and attempt-history display in `extensions/printelAnafEfactura/src/pages/admin/orderEdit/AnafComplianceSummary.tsx`
<!-- sequential -->
- [X] T030 [US2] Add localized admin settings, guidance, and manual-mode labels in `translations/ro/messages.json` and `translations/en/messages.json`
<!-- sequential -->
- [X] T031 [US2] Regenerate compiled User Story 2 artifacts under `extensions/printelAnafEfactura/dist/`

**Checkpoint**: US2 should be independently functional and testable.

---

## Phase 5: User Story 3 - Recover safely from ANAF/SPV downtime or delayed processing (Priority: P3)

**Goal**: Queue failed submissions, support manual approval/retry, surface attention states, and release the delayed email only after eventual ANAF success.

**Independent Test**: Simulate ANAF outage or manual mode, place an order, confirm no normal confirmation email is sent, verify the order is visible as queued/pending, restore ANAF or approve manually, and verify registration succeeds and one delayed confirmation is released.

### Tests for User Story 3

<!-- parallel-group: 7 -->
- [X] T032 [P] [US3] Add retry-queue and backoff unit coverage in `tests/unit/anaf-efactura-retry-queue.test.mjs`
- [X] T033 [P] [US3] Add manual-approval, material-change detection, and manual-review unit coverage in `tests/unit/anaf-efactura-manual-review.test.mjs`
- [X] T034 [P] [US3] Add blocked-authentication and resume-after-remediation unit coverage in `tests/unit/anaf-efactura-blocked-auth.test.mjs`
<!-- parallel-group: 7b -->
- [X] T035 [P] [US3] Add outage-recovery and manual-approval E2E coverage in `tests/e2e/anaf-efactura-recovery.spec.ts`

### Implementation for User Story 3

<!-- parallel-group: 8 -->
- [X] T036 [P] [US3] Implement the retry worker and backoff processing in `extensions/printelAnafEfactura/src/services/processAnafRetryQueue.ts` and `scripts/run-anaf-retry-worker.mjs`
- [X] T037 [P] [US3] Implement manual approval, operator retry, and order-status APIs with acting-admin persistence in `extensions/printelAnafEfactura/src/api/approveAnafSubmission/route.json`, `extensions/printelAnafEfactura/src/api/approveAnafSubmission/payloadSchema.json`, `extensions/printelAnafEfactura/src/api/approveAnafSubmission/[context]bodyParser[auth].ts`, `extensions/printelAnafEfactura/src/api/approveAnafSubmission/approveAnafSubmission.ts`, `extensions/printelAnafEfactura/src/api/retryAnafSubmission/route.json`, `extensions/printelAnafEfactura/src/api/retryAnafSubmission/retryAnafSubmission.ts`, and `extensions/printelAnafEfactura/src/api/orderAnafStatus/getOrderAnafStatus.ts`
- [X] T038 [P] [US3] Implement attention-required, blocked-authentication, and specific material-change detection handlers in `extensions/printelAnafEfactura/src/subscribers/order_status_updated/flagAnafManualReview.ts` and `extensions/printelAnafEfactura/src/services/markAnafAttentionRequired.ts`

<!-- sequential -->
- [X] T039 [US3] Add admin recovery actions, order-grid ANAF status visibility, and queue filtering UI in `extensions/printelAnafEfactura/src/pages/admin/orderEdit/AnafComplianceActions.tsx` and `extensions/printelAnafEfactura/src/pages/admin/orderGrid/AnafQueueFilter.tsx`
<!-- sequential -->
- [X] T040 [US3] Add localized outage, retry, approval, blocked-auth, and manual-review copy in `translations/ro/messages.json` and `translations/en/messages.json`
<!-- sequential -->
- [X] T041 [US3] Regenerate compiled User Story 3 artifacts under `extensions/printelAnafEfactura/dist/`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final operational readiness, shared fixtures, and full validation.

<!-- parallel-group: 9 -->
- [X] T042 [P] Document ANAF sandbox/live setup, retry-worker operations, and certificate/token guidance in `README.md` and `SETUP.md`
- [X] T043 [P] Add shared ANAF E2E helpers and sandbox stubs in `tests/e2e/helpers/anaf-efactura.ts`
- [X] T044 [P] Add reusable ANAF unit fixtures in `tests/unit/fixtures/anaf-efactura-fixtures.mjs`
<!-- parallel-group: 9b -->
- [X] T045 [P] Add env-gated ANAF sandbox validation coverage in `tests/e2e/anaf-efactura-sandbox.spec.ts`

<!-- sequential -->
- [X] T046 Review and update customer-visible invoice/confirmation timing help or policy copy in `README.md`, `SETUP.md`, `translations/ro/messages.json`, and `translations/en/messages.json`
<!-- sequential -->
- [X] T047 Run `npm run lint`
<!-- sequential -->
- [X] T048 Run `npm run test:unit`
<!-- sequential -->
- [X] T049 Run `npm run test:e2e`
<!-- sequential -->
- [X] T050 Run `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 → Phase 2**: Setup first, then foundational schema/client/bootstrap work.
- **Phase 2 → US1/US2**: Both can begin after foundational completion.
- **US3 depends on US1 + US2**: Retry/recovery needs the submission pipeline from US1 and the manual-policy/admin surfaces from US2.
- **Polish** depends on all required stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; delivers the first end-to-end compliant flow.
- **US2 (P2)**: Starts after Phase 2; may proceed in parallel with US1.
- **US3 (P3)**: Starts after US1 automatic flow and US2 manual-mode/admin visibility exist.

### Story Completion Order

1. Setup
2. Foundational
3. US1 (MVP flow)
4. US2 (admin configuration + manual hold)
5. US3 (retry/recovery/manual approval)
6. Polish + full validation

---

## Parallel Opportunities

- **9 explicit parallel groups**
- **26 tasks marked `[P]`**
- Best early fan-out:
  - GraphQL/contracts/client in Phase 2
  - US1 tests + automatic flow services
  - US2 settings page + connection API + policy logic
  - US3 retry worker + approval APIs + manual-review handlers

---

## Parallel Examples

### User Story 1
- Group 3: `T014`, `T015`, `T016`
- Group 4: `T017`, `T018`, `T019`

### User Story 2
- Group 5: `T023`, `T024`, `T025`
- Group 6: `T026`, `T027`, `T028`

### User Story 3
- Group 7: `T032`, `T033`, `T034`, `T035`
- Group 8: `T036`, `T037`, `T038`

---

## Implementation Strategy

### MVP First
1. Finish Phase 1
2. Finish Phase 2
3. Finish US1
4. Validate the automatic happy path end to end in ANAF sandbox
5. Stop for review before expanding scope

### Incremental Delivery
1. **Increment 1**: Automatic compliant flow with delayed email release (US1)
2. **Increment 2**: Admin connection settings and manual mode (US2)
3. **Increment 3**: Retry queue, recovery, approval, and manual review (US3)
4. **Final Gate**: Full validation, docs, and release hardening

### Production Note
Although US1 is the technical MVP, **production release should wait for US2 + US3**, because the feature is legally sensitive and must cover operator control and outage recovery before shipping.

---

## Task Summary

- **Total tasks**: 50
- **Setup + Foundational**: 13
- **US1**: 9
- **US2**: 9
- **US3**: 10
- **Polish**: 9

### Independent Test Criteria
- **US1**: Automatic mode registers with ANAF and sends one delayed normal confirmation containing the ANAF registration code.
- **US2**: Admin can configure connectivity, understand auth guidance, persist mode/environment, and confirm manual mode holds submission.
- **US3**: Outage/manual-approval flows queue safely, remain visible to admins, and release one delayed confirmation only after eventual ANAF success.

### Suggested MVP Scope
- **MVP**: Phase 1 + Phase 2 + US1
- **Release-ready scope**: All phases through T050

### Format Validation
- All tasks follow the required checklist format: checkbox, sequential `T###` ID, optional `[P]`, required `[US#]` only on story tasks, and explicit file paths.

## Extension Hooks

**Optional Hook**: fleet  
Command: `/speckit.fleet.review`  
Description: Pre-implementation review gate

Prompt: Run cross-model review to evaluate plan and tasks before implementation?  
To execute: `/speckit.fleet.review`
