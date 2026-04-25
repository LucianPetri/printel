# Tasks: Print-on-Demand Category Delivery Behavior

**Input**: Design documents from `/home/xaiko/apps/printel/specs/001-print-on-demand-category/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Required for admin settings, resolver logic, storefront CTA/delivery presentation, purchase-flow continuity, and inventory/order-placement behavior.

**Organization**: Tasks are grouped by user story to support independent validation and fleet parallelization.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the new extension workspace and register the build/config entry points.

<!-- parallel-group: 1 -->
- [X] T001 [P] Create `extensions/printelPrintOnDemand/package.json` with the compile script that runs `rm -rf dist && tsc -p tsconfig.json && mkdir -p dist/graphql/types/PrintOnDemand && cp src/graphql/types/PrintOnDemand/PrintOnDemand.graphql dist/graphql/types/PrintOnDemand/PrintOnDemand.graphql`
- [X] T002 [P] Create `extensions/printelPrintOnDemand/tsconfig.json` for the new ESM extension workspace build
- [X] T003 [P] Create `extensions/printelPrintOnDemand/src/bootstrap.ts` and the initial source folders under `extensions/printelPrintOnDemand/src/graphql/`, `src/lib/`, `src/migration/`, `src/pages/`, and `src/components/`

<!-- sequential -->
- [X] T004 Register `extensions/printelPrintOnDemand` in `config/default.json` and add the new workspace to `package.json` `build:extensions` and `typecheck`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared persistence, schema, helper, and locale foundations before story work starts.

**⚠️ CRITICAL**: No user story work should be considered complete until this phase is done.

<!-- parallel-group: 2 -->
- [X] T005 [P] Add the initial category POD migration scaffold in `extensions/printelPrintOnDemand/src/migration/Version-1.0.0.ts`
- [X] T006 [P] Define `Category.printOnDemandPolicy` and `Product.printOnDemandPresentation` in `extensions/printelPrintOnDemand/src/graphql/types/PrintOnDemand/PrintOnDemand.graphql`
- [X] T007 [P] Create shared POD range formatting and eligibility helpers in `extensions/printelPrintOnDemand/src/lib/printOnDemandPresentation.ts`

<!-- sequential -->
- [X] T008 Wire extension hook registration for category payload processing, cart item qty validation, checkout validation, and order-placement behavior in `extensions/printelPrintOnDemand/src/bootstrap.ts`

<!-- parallel-group: 3 -->
- [X] T009 [P] Add admin locale placeholders for POD settings and validation keys in `translations/ro/admin.json` and `translations/en/admin.json`
- [X] T010 [P] Add storefront locale placeholders for `Print Now` and POD delivery-range wording in `translations/ro/messages.json` and `translations/en/messages.json`

**Checkpoint**: Foundation ready for story implementation.

---

## Phase 3: User Story 1 - Configure a print-on-demand category (Priority: P1) 🎯 MVP

**Goal**: Let admins enable POD on a category and save valid min/max/unit settings that persist on reopen.

**Independent Test**: Admin can enable POD on a category, save valid values, reopen the category to confirm persistence, and is blocked by localized validation for invalid values.

### Tests for User Story 1

<!-- parallel-group: 4 -->
- [X] T011 [P] [US1] Add unit coverage for POD payload normalization, required-field validation, positive integers, `min <= max`, and disable-to-null behavior in `tests/unit/print-on-demand-category-policy.test.mjs`
- [X] T012 [P] [US1] Add admin E2E coverage for save/reopen and invalid category validation flows in `tests/e2e/print-on-demand-category-admin.spec.ts`
- [X] T013 [P] [US1] Create reusable POD category fixture builders in `tests/unit/fixtures/print-on-demand-category-fixtures.mjs`

### Implementation for User Story 1

<!-- parallel-group: 5 -->
- [X] T014 [P] [US1] Implement the POD settings card UI in `extensions/printelPrintOnDemand/src/pages/admin/categoryEdit+categoryNew/PrintOnDemandSettings.tsx`
- [X] T015 [P] [US1] Implement category POD save/load resolvers in `extensions/printelPrintOnDemand/src/graphql/types/PrintOnDemand/PrintOnDemand.resolvers.ts`
- [X] T016 [P] [US1] Add localized admin labels and validation copy in `translations/ro/admin.json` and `translations/en/admin.json`

<!-- sequential -->
- [X] T017 [US1] Implement category create/update normalization and localized validation failures in `extensions/printelPrintOnDemand/src/bootstrap.ts`
- [X] T018 [US1] Regenerate admin and GraphQL outputs in `extensions/printelPrintOnDemand/dist/pages/admin/categoryEdit+categoryNew/PrintOnDemandSettings.js`, `extensions/printelPrintOnDemand/dist/graphql/types/PrintOnDemand/PrintOnDemand.resolvers.js`, and `extensions/printelPrintOnDemand/dist/graphql/types/PrintOnDemand/PrintOnDemand.graphql` with `npm run build:extensions`

**Checkpoint**: User Story 1 is independently testable.

---

## Phase 4: User Story 2 - Show print-on-demand purchase messaging for out-of-stock items (Priority: P2)

**Goal**: Show category-specific POD CTA/delivery messaging on PDP, category listing, and search listing while preserving full add-to-cart through order-placement continuity for eligible out-of-stock items.

**Independent Test**: Two distinct POD categories with different ranges each show the correct `Print Now` CTA and delivery promise on PDP/category/search, and an eligible out-of-stock product can complete add-to-cart, cart reload, checkout, and successful order placement without negative stock.

### Tests for User Story 2

<!-- parallel-group: 6 -->
- [X] T019 [P] [US2] Add unit coverage for POD presentation resolution, equal-range formatting, direct-category lookup, and two-category range separation in `tests/unit/print-on-demand-presentation.test.mjs`
- [X] T020 [P] [US2] Add unit coverage for POD order-placement inventory skip logic and non-negative stock handling in `tests/unit/print-on-demand-order-placement.test.mjs`
- [X] T021 [P] [US2] Add E2E coverage for PDP, category listing, and search listing CTA surfaces plus add-to-cart, cart reload, checkout, and successful order placement in `tests/e2e/print-on-demand-purchase-flow.spec.ts`

### Implementation for User Story 2

<!-- parallel-group: 7 -->
- [X] T022 [P] [US2] Create two-category POD fixture data for Category A `5-7 days`, Category B `2-3 weeks`, and their out-of-stock products in `tests/e2e/fixtures/print-on-demand-catalog.ts`
- [X] T023 [P] [US2] Implement product/category POD read-model resolvers in `extensions/printelPrintOnDemand/src/graphql/types/PrintOnDemand/PrintOnDemand.resolvers.ts`
- [X] T024 [P] [US2] Implement shared CTA-label, delivery-range, and purchasability helpers in `extensions/printelPrintOnDemand/src/lib/printOnDemandPresentation.ts`

<!-- sequential -->
- [X] T025 [US2] Implement POD CTA and delivery rendering on the PDP in `extensions/printelPrintOnDemand/src/components/frontStore/catalog/ProductSingleForm.tsx` and `extensions/printelPrintOnDemand/src/pages/frontStore/productView/ProductView.tsx`

<!-- parallel-group: 8 -->
- [X] T026 [P] [US2] Implement shared list-item CTA and delivery rendering in `extensions/printelPrintOnDemand/src/components/frontStore/catalog/ProductListItemRender.tsx`
- [X] T027 [P] [US2] Extend category listing queries to request POD presentation data in `extensions/printelPrintOnDemand/src/pages/frontStore/categoryView/CategoryView.tsx`
- [X] T028 [P] [US2] Extend search listing queries to request POD presentation data in `extensions/printelPrintOnDemand/src/pages/frontStore/catalogSearch/SearchPage.tsx`

<!-- sequential -->
- [X] T029 [US2] Implement POD-aware add-to-cart, cart qty, cart persistence/reload, and checkout validation rules in `extensions/printelPrintOnDemand/src/bootstrap.ts`
- [X] T030 [US2] Extend `reduce_product_stock_when_order_placed()` to skip POD-eligible out-of-stock items and prevent negative managed stock in `extensions/printelPrintOnDemand/src/migration/Version-1.0.0.ts`
- [X] T031 [US2] Add localized storefront `Print Now` and POD delivery-range wording in `translations/ro/messages.json` and `translations/en/messages.json`
- [X] T032 [US2] Regenerate storefront, migration, and GraphQL outputs in `extensions/printelPrintOnDemand/dist/**` and `extensions/printelPrintOnDemand/dist/graphql/types/PrintOnDemand/PrintOnDemand.graphql` with `npm run build:extensions`

**Checkpoint**: User Story 2 is independently testable.

---

## Phase 5: User Story 3 - Preserve existing resale behavior outside the POD case (Priority: P3)

**Goal**: Keep current resale CTA, delivery messaging, and stock rejection behavior for in-stock POD-category products and non-POD products.

**Independent Test**: In-stock POD-category products and non-POD out-of-stock products keep existing PDP/category/search behavior, and checkout still rejects no-longer-eligible products using the normal out-of-stock rules.

### Tests for User Story 3

<!-- parallel-group: 9 -->
- [X] T033 [P] [US3] Add unit regression coverage for in-stock POD-category products, non-POD out-of-stock products, and disabled/invalid category policies in `tests/unit/print-on-demand-regression.test.mjs`
- [X] T034 [P] [US3] Add E2E regression coverage for unchanged PDP/category/search CTA and delivery behavior in `tests/e2e/print-on-demand-regression.spec.ts`

### Implementation for User Story 3

<!-- parallel-group: 10 -->
- [X] T035 [P] [US3] Harden non-applicable POD fallback rules in `extensions/printelPrintOnDemand/src/lib/printOnDemandPresentation.ts`
- [X] T036 [P] [US3] Preserve normal resale labels and delivery messaging in `extensions/printelPrintOnDemand/src/components/frontStore/catalog/ProductSingleForm.tsx` and `extensions/printelPrintOnDemand/src/components/frontStore/catalog/ProductListItemRender.tsx`
- [X] T037 [P] [US3] Restore standard checkout rejection when POD is disabled, invalid, or no longer eligible in `extensions/printelPrintOnDemand/src/bootstrap.ts`

<!-- sequential -->
- [X] T038 [US3] Regenerate fallback storefront outputs in `extensions/printelPrintOnDemand/dist/components/frontStore/catalog/*.js` and `extensions/printelPrintOnDemand/dist/pages/frontStore/**/*.js` with `npm run build:extensions`

**Checkpoint**: User Story 3 is independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final sync, validation, and release-quality verification across all stories.

<!-- parallel-group: 11 -->
- [X] T039 [P] Verify source/build sync for `extensions/printelPrintOnDemand/src/**`, `extensions/printelPrintOnDemand/dist/**`, and `extensions/printelPrintOnDemand/dist/graphql/types/PrintOnDemand/PrintOnDemand.graphql` by running `npm run build:extensions`
- [X] T040 [P] Run `npm run lint` against `extensions/printelPrintOnDemand/src/**`, `config/default.json`, and `translations/{ro,en}/*.json`
- [X] T041 [P] Run `npm run test:unit` for `tests/unit/print-on-demand-*.test.mjs`

<!-- sequential -->
- [X] T042 Run `npm run test:e2e` for `tests/e2e/print-on-demand-*.spec.ts`
- [X] T043 Run `npm run build` and verify final integrated outputs for `extensions/printelPrintOnDemand/dist/**` are included through `package.json` and `config/default.json`

---

## Dependencies & Execution Order

### Phase Dependencies
- Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5 -> Phase 6

### User Story Dependencies
- **US1** depends on Foundational only
- **US2** depends on US1 persisted category configuration and Foundational contracts
- **US3** depends on US2 shared storefront/purchase-flow behavior being in place

### Within Each Story
- Tests first
- Shared/domain logic before UI/rendering
- Runtime hooks before final compiled `dist/` outputs
- `npm run build:extensions` before final validation

---

## Parallel Opportunities

- **Group 1**: extension workspace scaffolding
- **Group 2**: migration/schema/helper foundation
- **Group 3**: locale placeholder setup
- **Group 4**: US1 test authoring
- **Group 5**: US1 UI/resolver/translation implementation
- **Group 6**: US2 test authoring
- **Group 7**: US2 fixtures/resolver/helper implementation
- **Group 8**: US2 listing-surface implementation
- **Group 9**: US3 regression test authoring
- **Group 10**: US3 fallback implementation
- **Group 11**: final build/lint/unit validation

---

## Parallel Examples by User Story

### US1
- Run **Group 4** in parallel, then **Group 5**, then T017-T018 sequentially.

### US2
- Run **Group 6** in parallel, then **Group 7**, then T025, then **Group 8**, then T029-T032 sequentially.

### US3
- Run **Group 9** in parallel, then **Group 10**, then T038 sequentially.

---

## Implementation Strategy

### MVP First
1. Complete Phases 1-2
2. Deliver **US1** only
3. Validate admin save/reopen + invalid-state blocking
4. Demo category-level POD configuration

### Incremental Delivery
1. Add **US2** for shopper-facing POD behavior and purchase-flow continuity
2. Validate two POD categories with distinct ranges
3. Add **US3** regression/fallback protections
4. Finish with Phase 6 full validation

### Suggested MVP Scope
- **User Story 1** only

---

## Summary

- **Total tasks**: 43
- **Task count by user story**:
  - **US1**: 8
  - **US2**: 14
  - **US3**: 6
- **Non-story tasks**:
  - Setup: 4
  - Foundational: 6
  - Polish: 5
- **Parallel opportunities identified**: 11 explicit parallel groups
- **Independent test criteria**:
  - **US1**: Admin save/reopen + invalid validation
  - **US2**: PDP/category/search `Print Now` + two-category ranges + full purchase flow + non-negative stock handling
  - **US3**: unchanged resale behavior for in-stock POD and non-POD products + standard rejection when no longer eligible
- **Format validation**: Confirmed all tasks follow the required checklist format with checkbox, task ID, optional `[P]`, required `[US#]` on story tasks, and explicit file paths

## Extension Hooks

**Optional Hook**: fleet
Command: `/speckit.fleet.review`
Description: Pre-implementation review gate

Prompt: Run cross-model review to evaluate plan and tasks before implementation?
To execute: `/speckit.fleet.review`
