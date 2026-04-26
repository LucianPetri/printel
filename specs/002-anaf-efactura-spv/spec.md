# Feature Specification: Romanian ANAF e-Factura / SPV Order Integration

**Feature Branch**: `002-anaf-efactura-spv`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Implement Romanian ANAF e-Factura / SPV integration for all customer orders. The system must allow admin-side ANAF connection/configuration in site settings, automatically generate the XML invoice for ANAF after order placement, support a configurable trigger mode (automatic on placement or manual approval), and send the customer the normal order confirmation email only after ANAF registration succeeds, including the order details and the ANAF registration code. If ANAF/SPV is unavailable, the order should still be accepted and ANAF submission queued for retry, with the normal confirmation email delayed until ANAF succeeds. The feature should be as hands-off as possible, piggyback on existing IDs/data where possible, include clear admin-panel guidance for how connection/token/certificate authentication works, and include test strategy requirements using the ts-anaf repo/test environment."

## Clarifications

### Session 2026-04-25

- Trigger mode must be configurable between full auto on placement and manual approval.
- Scope covers all customer orders.
- The customer receives the ANAF registration code in the normal order confirmation email after ANAF confirms registration.
- If ANAF/SPV is unavailable, the order is still accepted, ANAF submission is queued for retry, and the normal confirmation email remains delayed until ANAF succeeds.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register an order with ANAF before customer confirmation (Priority: P1)

As a shopper who has placed an order, I receive the normal order confirmation only after the store has successfully registered the invoice with ANAF, so my order confirmation reflects both the purchased items and the official ANAF registration code.

**Why this priority**: This is the core legal and customer-facing outcome. The store must not treat invoicing compliance and customer confirmation as separate, loosely coordinated steps.

**Independent Test**: With a valid ANAF connection in automatic mode, place an order, confirm the order is accepted immediately, verify that the ANAF invoice is generated and registered, and confirm that the normal order confirmation email is sent exactly once after registration with the ANAF registration code included.

**Acceptance Scenarios**:

1. **Given** ANAF connectivity is valid and trigger mode is automatic, **When** a shopper places an order, **Then** the order is accepted, the ANAF invoice is prepared from the order data, registration is attempted immediately, and the normal confirmation email is sent only after ANAF returns a successful registration result.
2. **Given** ANAF returns a successful registration for an order, **When** the system prepares the customer-facing confirmation, **Then** the email includes the normal order details and the ANAF registration code tied to that order.
3. **Given** the same order is reprocessed because of a retry, duplicate response, or operator action, **When** ANAF indicates the order was already registered or the system detects an existing successful registration, **Then** the order keeps a single registration outcome and the normal confirmation email is not sent more than once.

---

### User Story 2 - Configure ANAF/SPV connection and submission policy (Priority: P2)

As an administrator, I can configure ANAF/SPV connectivity and choose whether invoice submission happens automatically on placement or after manual approval, so the store can operate compliantly without relying on undocumented operational knowledge.

**Why this priority**: The store cannot safely use this feature unless administrators can connect the legal entity correctly, understand the authentication flow, and intentionally choose the submission policy.

**Independent Test**: An administrator can open site settings, provide the required ANAF connection details, review in-product guidance about token and certificate authentication, select automatic or manual trigger mode, save the configuration, and later reopen the settings to confirm the configuration and selected mode were preserved.

**Acceptance Scenarios**:

1. **Given** an administrator opens site settings for ANAF/SPV integration, **When** they provide the required company and connection details, **Then** the system saves the configuration and shows the current trigger mode and connection state on later visits.
2. **Given** an administrator is configuring ANAF/SPV access, **When** they review the admin guidance, **Then** the interface explains the prerequisites, token or certificate-based authentication flow, renewal expectations, and how to tell whether the store is connected.
3. **Given** an administrator switches the trigger mode to manual approval, **When** a new order is placed afterward, **Then** the order is accepted but ANAF submission waits for explicit admin approval instead of starting immediately.

---

### User Story 3 - Recover safely from ANAF/SPV downtime or delayed processing (Priority: P3)

As an operations administrator, I can rely on the store to accept orders during ANAF/SPV outages, queue submissions for retry, and release the delayed confirmation only after eventual ANAF success, so transient service problems do not cause lost sales or silent compliance gaps.

**Why this priority**: ANAF/SPV availability is outside the store's control, but the business still needs continuity, traceability, and safe customer communication.

**Independent Test**: Simulate ANAF/SPV unavailability or manual approval mode, place an order, verify the order is accepted without sending the normal confirmation email, confirm the order appears in a pending queue or approval state, then restore ANAF availability or approve the order and verify registration completes and the delayed confirmation email is sent exactly once.

**Acceptance Scenarios**:

1. **Given** ANAF/SPV is unavailable at order time, **When** a shopper places an order, **Then** the order is accepted, the submission is queued for retry, the order is visible to administrators as pending, and the normal confirmation email is withheld until registration eventually succeeds.
2. **Given** an order is waiting in a retry queue, **When** ANAF/SPV becomes available again and registration succeeds, **Then** the order status is updated to registered and the delayed normal confirmation email is sent once with the ANAF registration code.
3. **Given** an order is waiting for manual approval, **When** an authorized administrator approves it and ANAF registration succeeds, **Then** the order leaves the pending-approval state, the ANAF registration result is stored on the order, and the delayed normal confirmation email is sent.

### Edge Cases

- The store must not send the normal order confirmation email before ANAF success, even if the order itself was accepted and paid.
- ANAF authentication may fail because credentials are missing, a token expires, or certificate-based authorization is no longer valid; affected orders must not disappear from operational visibility.
- ANAF may validate the invoice payload but respond with delayed processing, partial outage behavior, or duplicate/already-registered results; the system must reconcile these without duplicate customer emails.
- In manual approval mode, an order may remain pending for an extended period; administrators need a clear state showing why the customer has not yet received the normal confirmation email.
- A queued order may be retried multiple times; submission tracking must preserve the attempt history and current blocking reason.
- If the order data changes after a submission was queued or after ANAF already registered the invoice, the system must not silently replace the earlier compliance record.
- If an order is canceled before queued ANAF submission succeeds, the system must escalate the order for manual compliance review rather than silently discarding the pending obligation.
- Test and live ANAF environments must remain clearly distinguishable so sandbox activity is never mistaken for production registration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST apply ANAF e-Factura / SPV handling to all customer orders accepted by the storefront.
- **FR-002**: The system MUST allow administrators to configure ANAF/SPV connectivity from site settings, including the legal entity details and the connection information needed for ANAF authentication.
- **FR-003**: The system MUST present clear admin-side guidance describing prerequisites, token and certificate authentication flow, renewal or expiration expectations, and how administrators can verify whether the store is currently connected.
- **FR-004**: The system MUST make the active ANAF operating mode visible in admin settings, including whether the store is configured for test or live use and whether submission is set to automatic or manual approval.
- **FR-005**: The system MUST support two trigger modes for every order: automatic submission immediately after placement and manual submission after explicit admin approval.
- **FR-006**: After order placement, the system MUST generate an ANAF-ready invoice payload using the existing order, customer, store, and product data already captured by the storefront wherever those identifiers and values are sufficient.
- **FR-007**: In automatic mode, the system MUST attempt ANAF submission immediately after the order is accepted.
- **FR-008**: In manual approval mode, the system MUST place the order into a pending-approval state and MUST NOT submit to ANAF until an authorized administrator approves the submission.
- **FR-009**: The system MUST accept the customer order even when ANAF/SPV is unavailable, temporarily failing, or processing slowly.
- **FR-010**: If ANAF submission cannot complete immediately, the system MUST queue the order for retry without requiring the customer or administrator to re-enter the order data.
- **FR-011**: The system MUST delay the normal customer order confirmation email until ANAF registration succeeds for that order.
- **FR-012**: Once ANAF registration succeeds, the system MUST send the normal order confirmation email containing the usual order details plus the ANAF registration code for that order.
- **FR-013**: The system MUST ensure the normal order confirmation email is sent at most once per order, even if submission is retried, approved manually, resumed after an outage, or reconciled from a duplicate ANAF response.
- **FR-014**: The system MUST persist an order-level ANAF compliance record that includes at minimum the current status, the chosen trigger mode, the ANAF registration code after success, the latest failure reason when blocked, and the timestamps of meaningful state changes.
- **FR-015**: The system MUST provide administrators with order-level visibility into ANAF states such as pending approval, queued for retry, submitting, registered, and requiring attention.
- **FR-016**: The system MUST prevent duplicate ANAF registrations for the same order by using a consistent order identity across retries and by reconciling already-registered responses without creating a second customer confirmation.
- **FR-017**: If the ANAF connection becomes invalid because of missing credentials, expired authorization, failed certificate-based access, or related authentication problems, the system MUST stop silent submission attempts and surface actionable remediation guidance to administrators.
- **FR-018**: After repeated unsuccessful submission attempts, the system MUST move the order into a clearly visible attention-required state instead of retrying indefinitely without administrator awareness.
- **FR-019**: If an order is canceled or materially changed before queued ANAF submission succeeds, the system MUST flag it for manual compliance review rather than silently discarding or overwriting the pending submission.
- **FR-020**: If an order has already been registered successfully with ANAF, the system MUST preserve that registration record and MUST NOT silently replace it with a newly generated record.
- **FR-021**: All new admin-facing and customer-facing labels, guidance, statuses, errors, and email content introduced by this feature MUST be localizable.
- **FR-022**: For this feature, an authorized administrator MUST be an admin user who already has access to site settings and order-management actions, and the system MUST record which administrator approved or manually retried a submission.
- **FR-023**: For the purpose of customer email release, ANAF registration succeeds only when the system receives a final registered outcome with a persisted ANAF registration code or equivalent terminal registered response; accepted-for-processing, delayed-processing, queued, or polling states MUST NOT release the email.
- **FR-024**: If ANAF authentication becomes invalid, the system MUST pause queued automatic submissions, move affected orders into a blocked-authentication state, and require operator remediation before submission attempts resume.
- **FR-025**: The automatic retry policy MUST use escalating backoff and MUST stop after five failed attempts, after which the order enters an attention-required state instead of retrying indefinitely.
- **FR-026**: A materially changed queued order MUST include at least cancellation, billing-identity changes, company or tax-identity changes, store legal-entity changes, currency changes, price or tax-total changes, line-item additions or removals, and line-item quantity changes after the queued invoice snapshot was created.
- **FR-027**: The persisted compliance record MUST include attempt history, actor attribution for approval and retry actions, immutable invoice snapshot identity, and timestamps for every meaningful submission-state transition needed for audit review.

### Operational & Safety Expectations

- This feature is legally sensitive and money-related, so no release is acceptable unless the happy path, manual-approval path, outage-and-retry path, and duplicate-prevention path have all been validated end to end.
- Orders must never be lost or blocked solely because ANAF/SPV is unavailable at the moment of placement.
- Customer communication must remain compliance-aware: the normal confirmation email is intentionally delayed, and no alternate email may imply ANAF registration succeeded before it actually has.
- Sensitive connection materials and authentication artifacts must be protected in admin surfaces so administrators can confirm configuration health without exposing secrets in plain text.
- Admin operators need a clear operational path for pending approvals, retry failures, invalid connection states, and orders that require manual compliance review.
- The system must make the distinction between sandbox testing and live submission unmistakable to reduce the risk of sending live invoices unintentionally.
- Approval, retry, and remediation actions must remain attributable to named administrators for auditability.

### Compliance, Localization & Operational Constraints

- Touched delivery surfaces are expected to include `config/`, affected `extensions/*`, generated `dist/`, `translations/`, and `tests/`.
- Because this feature changes invoicing, legal compliance, and customer communication for every order, Romanian remains the default experience and all supported locales must receive equivalent admin and customer wording for statuses, errors, guidance, and email content. At minimum, `translations/ro/*` and `translations/en/*` must be updated together.
- Impacted admin settings include ANAF connection and authentication guidance, trigger mode selection, environment visibility, and operational state indicators. If any customer-visible policy or help content references invoicing timing, the corresponding CMS or policy surface must also be reviewed for consistency.
- Persisted data is required for store-level ANAF connection configuration and for order-level ANAF compliance tracking, including registration status, registration code, retry state, and manual-review indicators. These values must be retrievable in site settings, order management, and any operational queue or approval view introduced for this feature.
- Existing order identifiers and already captured order data are the preferred source of truth for invoice generation and reconciliation; the feature must avoid introducing duplicate manual data entry unless ANAF requires missing legal information.
- The reference integration source is the `ts-anaf` repository and its ANAF sandbox or test environment. Test strategy, operator guidance, and release validation must align with that reference capability set.
- Validation for this feature must include `npm run lint`, `npm run test:unit`, `npm run test:e2e`, and `npm run build`.
- Before production activation, the team must complete end-to-end testing in the ANAF test environment for automatic submission, manual approval, outage-and-retry recovery, invalid-authentication handling, duplicate-response handling, and confirmation-email release behavior.
- Any customer-facing help, legal, or policy surface that references invoice timing or order confirmation timing must be reviewed and updated if this feature changes the promised customer experience.

### Key Entities *(include if feature involves data)*

- **ANAF Connection Profile**: The store-level compliance configuration that identifies the legal entity, the current ANAF environment, the connection state, and the information needed to authenticate safely.
- **ANAF Submission Policy**: The store-level rule that determines whether newly accepted orders go directly to ANAF or wait for manual approval.
- **Order ANAF Compliance Record**: The order-owned status record that tracks whether the order is pending approval, queued, submitting, registered, blocked, or flagged for manual review, along with the ANAF registration code after success.
- **Order ANAF Attempt Log**: The audit trail of every automatic, manual, retry, or reconciliation attempt, including the acting administrator when applicable, the request identity, the resulting state, and the ANAF response summary.
- **Customer Confirmation Hold**: The business rule that keeps the normal order confirmation email unsent until ANAF registration has succeeded.
- **ANAF Invoice Payload**: The invoice representation generated from existing order and store data for registration with ANAF.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing over at least 20 representative sandbox orders, 100% of orders submitted successfully to ANAF receive their normal customer confirmation email only after ANAF registration succeeds and include the correct ANAF registration code.
- **SC-002**: In simulated ANAF/SPV outage testing over at least 10 representative sandbox orders, 100% of orders are still accepted by the storefront, recorded in a visible retry or manual-review state, and send no normal confirmation email before later ANAF success.
- **SC-003**: In administrator usability testing, a trained admin can configure or update ANAF connection settings and trigger mode in under 10 minutes without needing undocumented support steps.
- **SC-004**: In end-to-end sandbox validation, the automatic, manual-approval, retry-recovery, invalid-authentication, duplicate-prevention, and delayed-email-release flows all complete without unresolved critical defects before the feature is approved for release.
- **SC-005**: In regression testing over at least 20 representative sandbox and automated test orders, 0 orders send duplicate normal confirmation emails as a result of retries, delayed ANAF responses, or manual approval actions.

## Assumptions

- Printel operates one active ANAF/SPV configuration per store legal entity for the first release of this feature.
- The existing order record already contains enough commercial data to generate the ANAF invoice payload, with only legally required company connection settings added at the store level.
- The current normal order confirmation email remains the customer-facing email for this flow and is being delayed and enriched, not replaced with a separate compliance-only email.
- Order acceptance, payment handling, and storefront checkout availability continue to behave as they do today; this feature adds invoicing compliance control and email-release coordination on top of the existing order flow.
- Finance or operations staff are available to review orders that enter manual approval, retry attention, or manual compliance review states.
