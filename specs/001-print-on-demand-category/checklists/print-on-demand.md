# Print-on-Demand Requirements Checklist: Print-on-Demand Category Delivery Behavior

**Purpose**: Validate requirement quality for category-owned print-on-demand behavior before implementation
**Created**: 2026-04-25
**Feature**: [Link to spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 Are category-setting requirements complete for enable/disable state, min/max values, unit selection, persistence, and later re-editing? [Completeness, Spec §FR-001–FR-004]
- [ ] CHK002 Are shopper-facing scope requirements explicit about every surface that must adopt the print-on-demand label and delivery promise, rather than only implying a generic “purchase surface”? [Gap, Spec §User Story 2, Spec §FR-006–FR-007]
- [ ] CHK003 Are requirements defined for how print-on-demand eligibility should be evaluated across product detail, cart, and checkout so “remain purchasable” cannot be interpreted as UI-only? [Completeness, Spec §FR-013]
- [ ] CHK004 Are requirements explicit about whether previously saved print-on-demand values should be hidden, preserved, or cleared when a category is later disabled? [Completeness, Spec §Edge Cases, Spec §FR-011]
- [ ] CHK005 Are localization requirements complete for shopper text, admin labels, validation copy, and delivery-range wording across all supported locales? [Completeness, Spec §FR-012]

## Requirement Clarity

- [ ] CHK006 Is the authoritative category for print-on-demand behavior explicitly defined, including whether only the product’s direct category assignment is in scope? [Clarity, Assumption]
- [ ] CHK007 Is “normal resale behavior remains unchanged” specific enough to identify which purchase labels, delivery promises, and ordering rules must stay untouched? [Clarity, Spec §FR-008–FR-009]
- [ ] CHK008 Is the required storefront wording for equal min/max values precise enough to avoid inconsistent single-value delivery promises across surfaces and locales? [Clarity, Spec §Edge Cases]
- [ ] CHK009 Are validation requirements precise about allowed numeric formats and bounds beyond “greater than zero,” such as decimals, leading zeros, or unrealistic high values? [Gap, Spec §FR-003]
- [ ] CHK010 Is “immediately revert to normal resale messaging” quantified well enough to define whether propagation may depend on cache refresh, republish, or the next page data fetch? [Ambiguity, Spec §Edge Cases]

## Requirement Consistency

- [ ] CHK011 Do admin validation requirements align with storefront safety requirements so invalid category data cannot produce customer-visible print-on-demand messaging? [Consistency, Spec §FR-003, Spec §FR-011]
- [ ] CHK012 Are print-on-demand applicability rules consistent between the user stories, functional requirements, and assumptions for out-of-stock, in-stock, and non-print-on-demand products? [Consistency, Spec §User Story 2, Spec §User Story 3, Spec §FR-005–FR-009]
- [ ] CHK013 Do localization and operational-constraint requirements agree on Romanian-default behavior and parity for all already-supported locales? [Consistency, Spec §FR-012, Spec §Compliance, Localization & Operational Constraints]
- [ ] CHK014 Are category-specific range requirements consistent with the single authoritative category assumption, or does the spec leave room for conflicting multi-category interpretation? [Conflict, Spec §FR-010, Assumption]

## Acceptance Criteria Quality

- [ ] CHK015 Can the success criteria objectively verify category-specific delivery promises without relying on subjective sampling or undefined “reviewed products” sets? [Measurability, Spec §SC-002–SC-004]
- [ ] CHK016 Are acceptance scenarios measurable for invalid admin inputs, including what counts as rejection feedback and when saving must be blocked? [Acceptance Criteria, Spec §User Story 1]
- [ ] CHK017 Do acceptance criteria make translation completeness verifiable, especially for Romanian default copy and equivalent wording in all supported locales? [Gap, Spec §FR-012]
- [ ] CHK018 Can “under 1 minute without manual support” be measured consistently, including the starting point, allowed prep state, and what qualifies as support? [Clarity, Spec §SC-001]

## Scenario Coverage

- [ ] CHK019 Are primary requirements complete for all intended states: out-of-stock POD products, in-stock POD-category products, and out-of-stock non-POD products? [Coverage, Spec §FR-005–FR-010]
- [ ] CHK020 Are alternate-flow requirements defined for categories whose delivery ranges differ, so cross-category comparisons remain unambiguous? [Coverage, Spec §FR-010]
- [ ] CHK021 Are exception-flow requirements documented for partially missing, stale, or corrupted category POD data retrieved at storefront time? [Gap, Exception Flow]
- [ ] CHK022 Are recovery requirements specified for turning POD off after it has been active, including how affected products return to standard messaging and ordering rules? [Coverage, Recovery, Spec §Edge Cases]

## Non-Functional Requirements

- [ ] CHK023 Are performance expectations specific enough to bound any extra category-policy lookups or shopper-facing latency introduced by the new delivery promise? [Gap, Non-Functional]
- [ ] CHK024 Are accessibility requirements defined for any new admin controls and any changed shopper-facing labels or delivery text? [Gap, Non-Functional]
- [ ] CHK025 Are auditability or change-tracking requirements defined for category policy edits if merchandising teams need to understand who changed delivery promises and when? [Gap, Dependency]

## Dependencies, Assumptions & Ambiguities

- [ ] CHK026 Is the assumption that stock status remains the single source of truth sufficient, or must requirements also define how POD orders affect inventory when stock is already zero? [Assumption, Spec §Assumptions]
- [ ] CHK027 Are dependency requirements documented for translation assets, generated build artifacts, and extension/config touchpoints so implementation scope is not inferred ad hoc? [Dependency, Spec §Compliance, Localization & Operational Constraints]
- [ ] CHK028 Does the spec clearly exclude parent-category inheritance, listing/search-surface changes, and separate checkout paths for v1, or are these left implicit? [Boundary, Gap, Assumption]

## Revised Plan Alignment

- [ ] CHK029 Do the requirements explicitly define POD eligibility as applying only to products that are currently out of stock and directly assigned to a POD-enabled category with a valid range? [Alignment, Spec §FR-005, Plan §Core Design Decisions]
- [ ] CHK030 Do the requirements clearly state that the existing purchase flow includes add-to-cart, cart persistence/reload, checkout, and successful order placement rather than only a relabeled button? [Alignment, Spec §FR-013, Plan §Core Design Decisions]
- [ ] CHK031 Are requirements explicit that POD-eligible out-of-stock orders must not decrement inventory further or drive managed stock negative at order placement? [Gap, Inventory Handling, Plan §Order placement behavior]
- [ ] CHK032 Do the requirements clearly cover all intended CTA surfaces for v1: product detail page, category listings, and search listings? [Scope, Plan §CTA scope]
- [ ] CHK033 Are verification requirements explicit that at least two POD categories with different configured ranges must be tested to prove category-specific messaging works correctly? [Coverage, Spec §FR-010, Plan §Verification Strategy]
- [ ] CHK034 Do the requirements define how checkout should behave if a product loses POD eligibility after being added to cart but before order placement completes? [Exception Flow, Plan §Cart and order validation]
- [ ] CHK035 Are generated-output obligations explicit enough that implementers must keep `src/**`, `dist/**`, and copied GraphQL artifacts synchronized through the documented build workflow? [Build Sync, Spec §Compliance, Plan §Generated Output Workflow]
- [ ] CHK036 Do localization and validation requirements fully cover the new admin labels, storefront CTA text, delivery wording, and inventory-related validation/error states across supported locales? [Localization, Validation, Spec §FR-003, Spec §FR-012]
