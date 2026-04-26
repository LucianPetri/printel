# ANAF Checklist: Romanian ANAF e-Factura / SPV Order Integration

**Purpose**: Validate the quality, completeness, and audit-readiness of requirements for the ANAF e-Factura / SPV order flow before implementation and release.  
**Created**: 2026-04-25  
**Feature**: [/home/xaiko/apps/printel/specs/002-anaf-efactura-spv/spec.md](/home/xaiko/apps/printel/specs/002-anaf-efactura-spv/spec.md)

**Note**: Generated from the feature spec plus the orchestrator's structured plan summary for a legally sensitive, money-related workflow.

## Requirement Completeness

- [ ] CHK001 Are the in-scope order sources defined precisely enough that "all customer orders accepted by the storefront" cannot be interpreted inconsistently for manual, imported, or atypical order flows? [Clarity, Spec §FR-001, Assumptions]
- [ ] CHK002 Are the required ANAF/SPV configuration fields fully specified, or does the spec leave the legal-entity and authentication data set open-ended? [Completeness, Spec §FR-002]
- [ ] CHK003 Are the minimum required admin guidance topics fully enumerated for prerequisites, token flow, certificate flow, renewal, expiration, and connection-health interpretation? [Completeness, Spec §FR-003]
- [ ] CHK004 Are the requirements complete for both trigger modes across placement, approval, submission, retry, and email release so no mode-specific behavior is left implicit? [Completeness, Spec §FR-005, §FR-007, §FR-008, §FR-011]
- [ ] CHK005 Are the persisted compliance-record requirements complete enough to support legal audit, operator triage, and duplicate-email prevention without relying on undocumented fields? [Completeness, Spec §FR-014, Key Entities]
- [ ] CHK006 Are operational requirements defined for attention-required orders beyond visibility alone, including ownership, escalation, and expected admin action? [Gap, Spec §FR-018, Operational & Safety Expectations]

## Requirement Clarity

- [ ] CHK007 Is "immediately after the order is accepted" precise enough to distinguish whether submission must begin inline, asynchronously within a bounded delay, or merely before later batch processing? [Ambiguity, Spec §FR-007]
- [ ] CHK008 Is "authorized administrator" defined with enough specificity to know who may manually approve ANAF submission? [Gap, Spec §FR-008]
- [ ] CHK009 Are the source-of-truth rules for generating the ANAF invoice payload explicit about what happens when existing order data is insufficient or legally incomplete? [Clarity, Spec §FR-006, Assumptions]
- [ ] CHK010 Is "ANAF registration succeeds" defined clearly enough to distinguish final registration from intermediate, delayed-processing, or accepted-for-processing states? [Ambiguity, Spec §FR-011, §FR-012, Edge Cases]
- [ ] CHK011 Is "repeated unsuccessful submission attempts" quantified with a clear retry threshold or policy boundary rather than left to implementation judgment? [Ambiguity, Spec §FR-018]
- [ ] CHK012 Is "materially changed before queued ANAF submission succeeds" defined with objective criteria so operators can determine when manual compliance review is mandatory? [Clarity, Spec §FR-019]

## Requirement Consistency

- [ ] CHK013 Are status names and lifecycle states consistent between the functional requirements, edge cases, key entities, and success criteria? [Consistency, Spec §FR-014, §FR-015, Key Entities, §SC-002]
- [ ] CHK014 Are the delayed-email rules consistent across outage, manual-approval, duplicate-response, and already-registered scenarios so no section implies an earlier customer confirmation is acceptable? [Consistency, Spec §FR-011, §FR-012, §FR-013, Edge Cases]
- [ ] CHK015 Are sandbox/live environment requirements aligned between admin visibility, operator guidance, and release-validation expectations? [Consistency, Spec §FR-004, Operational & Safety Expectations, Constraints]
- [ ] CHK016 Are localization requirements consistent with the stated repo delivery surfaces so statuses, guidance, errors, and email content are all covered in both `translations/ro/*` and `translations/en/*`? [Consistency, Spec §FR-021, Constraints]

## Acceptance Criteria Quality

- [ ] CHK017 Can the "at most once per order" email rule be objectively verified from the written requirements, or is additional acceptance wording needed for auditability? [Measurability, Spec §FR-013, §SC-005]
- [ ] CHK018 Are the success criteria measurable enough for a legal-release decision, including explicit reviewed sample scope or exit thresholds rather than qualitative "reviewed orders"? [Measurability, Spec §SC-001, §SC-002, §SC-005]
- [ ] CHK019 Are admin-usability expectations sufficiently specific to determine what counts as "without needing undocumented support steps"? [Clarity, Spec §SC-003]
- [ ] CHK020 Are the required end-to-end validation flows traceable from the functional requirements to success criteria without missing a must-have scenario? [Traceability, Spec §FR-005, §FR-017, §FR-018, §FR-016, §SC-004]

## Scenario Coverage

- [ ] CHK021 Are requirements complete for the primary automatic-submission flow from order acceptance through ANAF success to delayed normal confirmation release? [Coverage, User Story 1, Spec §FR-007, §FR-011, §FR-012]
- [ ] CHK022 Are requirements complete for the manual-approval flow, including pending visibility, approval authority, eventual submission, and single confirmation release? [Coverage, User Story 2, User Story 3, Spec §FR-008, §FR-015]
- [ ] CHK023 Are requirements complete for ANAF/SPV outage and recovery, including queue entry, retry progression, restored-success reconciliation, and continued confirmation hold? [Coverage, User Story 3, Spec §FR-009, §FR-010, §FR-011]
- [ ] CHK024 Are requirements defined for invalid-connection and expired-authentication scenarios at both store level and order level, including whether queued orders pause, fail, or await remediation? [Coverage, Spec §FR-017, Edge Cases]
- [ ] CHK025 Are post-placement change scenarios fully addressed for canceled orders, modified orders, and orders already registered with ANAF so compliance records cannot be silently replaced or lost? [Coverage, Spec §FR-019, §FR-020, Edge Cases]

## Dependencies, Assumptions & Non-Functional Requirements

- [ ] CHK026 Are the external-dependency assumptions around `ts-anaf` and the ANAF test environment documented well enough to know which capabilities are required, trusted, or intentionally out of scope for this feature? [Dependency, Spec Constraints, User input]
