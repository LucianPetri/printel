# Implementation Plan: Print-on-Demand Category Delivery Behavior

**Branch**: `001-print-on-demand-category` | **Date**: 2026-04-25 | **Spec**: `/home/xaiko/apps/printel/specs/001-print-on-demand-category/spec.md`
**Input**: Feature specification from `/home/xaiko/apps/printel/specs/001-print-on-demand-category/spec.md`

## Summary

Implement category-level print-on-demand (POD) policy in a dedicated EverShop extension so admins can enable POD per category and configure an out-of-stock delivery range. On the storefront, products in POD-enabled categories keep normal resale behavior while in stock, but when out of stock they remain purchasable through the existing add-to-cart -> cart -> checkout -> order-placement flow, show a `Print Now` CTA, and display the category-specific POD delivery range. The design explicitly covers multiple POD categories with different ranges, all affected buy-button surfaces, and POD-safe order placement without forcing managed-stock products into negative inventory.

## Review Fixes Applied

- **Existing purchase flow clarified**: in scope means successful continuation through **add-to-cart, cart persistence/reload, checkout, and order placement**, not just a relabeled button.
- **CTA surface scope resolved**: implement on **all current storefront buy-button surfaces**:
  1. product detail page
  2. category product grid/list
  3. search results product grid/list
- **Order placement behavior fixed**: keep `manage_stock` unchanged; allow POD only for **currently out-of-stock** eligible items; skip stock decrement at order placement for those POD-eligible out-of-stock items so inventory does not go negative.
- **Multi-category verification added**: tests must cover **at least two POD categories** with different configured ranges.
- **Generated-output workflow made explicit**: source edits must be followed by the workspace compile script and root `npm run build:extensions`, then final `npm run build`.

## Technical Context

**Language/Version**: TypeScript 6.0.2 + Node.js ESM, EverShop 2.1.2
**Primary Dependencies**: EverShop core, React, react-hook-form, PostgreSQL query builder
**Storage**: PostgreSQL (`category`, `product`, `product_inventory`, `cart_item`, `order_item`)
**Testing**: `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run build`
**Target Platform**: Linux-hosted EverShop storefront/admin
**Project Type**: EverShop web application with extension workspaces
**Performance Goals**: no noticeable storefront/admin latency regression; POD data must piggy-back on existing product/category reads without introducing extra per-item round trips in render loops
**Constraints**: extension-first delivery, Romanian default/localized copy, committed `dist/` outputs, copied GraphQL artifacts must stay in sync with `src/`, no secret/config drift
**Scale/Scope**: one storefront/admin, many categories, multiple POD categories with independent ranges

## Constitution Check

*GATE: Pass before implementation and re-check after design.*

- [x] **Extension-first scope identified**
  Touched surfaces: `config/default.json`, `package.json`, `extensions/printelPrintOnDemand/src/**`, `extensions/printelPrintOnDemand/dist/**`, copied GraphQL artifacts under `dist/graphql/**`, `translations/**`, `tests/**`

- [x] **Romanian/compliance impact reviewed**
  No pricing/privacy/legal flow change. New admin/storefront copy must ship in Romanian first and also be added to all supported locales.

- [x] **`src` -> `dist` compile path identified**
  New workspace compile script must be:
  `rm -rf dist && tsc -p tsconfig.json && mkdir -p dist/graphql/types/PrintOnDemand && cp src/graphql/types/PrintOnDemand/PrintOnDemand.graphql dist/graphql/types/PrintOnDemand/PrintOnDemand.graphql`
  Root workflow must then run:
  `npm run build:extensions`
  Final release verification must run:
  `npm run build`

- [x] **Validation commands listed via repo entry points**
  `npm run lint`
  `npm run test:unit`
  `npm run test:e2e`
  `npm run build`

- [x] **Config and secret handling documented**
  Extension registration stays in committed `config/default.json`; no new secrets; environment values remain in `.env*` only.

## Project Structure

```text
config/
└── default.json

package.json

extensions/
├── printelTheme/
├── printelLegalFooter/
├── printelCookieBanner/
└── printelPrintOnDemand/
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── bootstrap.ts
    │   ├── migration/
    │   │   └── Version-1.0.0.ts
    │   ├── graphql/types/PrintOnDemand/
    │   │   ├── PrintOnDemand.graphql
    │   │   └── PrintOnDemand.resolvers.ts
    │   ├── pages/admin/categoryEdit+categoryNew/
    │   │   └── PrintOnDemandSettings.tsx
    │   ├── pages/frontStore/productView/
    │   │   └── ProductView.tsx
    │   ├── pages/frontStore/categoryView/
    │   │   └── CategoryView.tsx
    │   ├── pages/frontStore/catalogSearch/
    │   │   └── SearchPage.tsx
    │   └── components/frontStore/catalog/
    │       ├── ProductSingleForm.tsx
    │       └── ProductListItemRender.tsx
    └── dist/
        └── ...
tests/
├── unit/
└── e2e/

translations/
├── ro/
└── en/
```

**Structure Decision**: deliver the feature in a new `extensions/printelPrintOnDemand` workspace because this feature spans migration, GraphQL, admin UI, storefront rendering, cart/checkout behavior, and generated outputs.

## Core Design Decisions

### 1. Category is the POD source of truth

Persist on `category`:

- `print_on_demand_enabled BOOLEAN NOT NULL DEFAULT false`
- `print_on_demand_min INT NULL`
- `print_on_demand_max INT NULL`
- `print_on_demand_unit VARCHAR(16) NULL`

If POD is disabled, range fields are nulled.

### 2. POD applies only for direct category assignment

Use `product.category_id` only. No parent inheritance and no multi-category conflict resolution in v1.

### 3. "Existing purchase flow" means full order completion

For eligible out-of-stock POD products, the shopper must be able to:

1. click CTA
2. add item to cart
3. view/reload cart without item-level stock rejection
4. continue through checkout
5. place the order successfully via the standard order creation path

No separate POD checkout path is introduced.

### 4. CTA scope includes all current buy-button surfaces

Implement POD CTA/delivery behavior on:

- **PDP**: `ProductSingleForm`
- **Category listing**: `ProductListItemRender` used by `CategoryView`
- **Search listing**: `ProductListItemRender` used by `SearchPage`

Collection widgets are not in scope unless they render add-to-cart buttons via the same shared renderer.

### 5. Order placement behavior for managed stock

**Concrete decision**:

- Keep `product_inventory.manage_stock` unchanged.
- POD eligibility exists only when:
  - product is currently out of stock, and
  - product category has POD enabled with a valid range.
- In-stock POD-category products remain standard resale items.
- For **out-of-stock POD-eligible** order items, order placement must **not decrement inventory further**.
- For in-stock items and all non-POD items, existing decrement behavior remains unchanged.

Implementation detail: replace the checkout stock-reduction function in the new extension migration so `reduce_product_stock_when_order_placed()` skips decrement when the ordered product is currently out of stock and its direct category has POD enabled. This avoids negative inventory while preserving normal stock handling for non-POD and in-stock cases.

### 6. Cart and order validation must be POD-aware

Do not solve this with UI-only changes.

Implement in `src/bootstrap.ts`:

- category create/update payload normalization + validation
- POD-aware `cartItemFields` resolver extension for `qty`
- POD-aware order validation rule so checkout/order creation succeeds only when the item is either:
  - in stock normally, or
  - out of stock and currently POD-eligible

If the category is later disabled or made invalid before checkout completion, the standard out-of-stock failure should return.

## Phase 0: Research Closure

All plan-level unknowns are resolved. The previous open issue about order-placement stock decrement is now closed by the explicit "skip decrement for POD-eligible out-of-stock items" rule above.

## Phase 1: Design & Contracts

### Admin contract

Add a POD settings card to category create/edit:

- enable toggle
- min number
- max number
- unit select: `days | weeks`

Validation:
- all three range fields required when enabled
- integers only
- `> 0`
- `min <= max`

### GraphQL/read contract

Expose derived POD read models:

- `Category.printOnDemandPolicy`
- `Product.printOnDemandPresentation`

`Product.printOnDemandPresentation` must at minimum include:

- `applies`
- `purchasable`
- `ctaLabel`
- `sourceCategoryId`
- `deliveryRange { min, max, unit, label }`

### Storefront behavior contract

When `printOnDemandPresentation.applies = true`:

- CTA label = localized `Print Now`
- delivery message = category POD range
- add-to-cart enabled
- cart/checkout/order placement continue through standard flow

When false:

- preserve current label, delivery message, and stock rules

## Implementation Plan

### Workstream A — Extension scaffolding
1. Create `extensions/printelPrintOnDemand`
2. Register extension in `config/default.json`
3. Update root scripts in `package.json`:
   - append workspace to `build:extensions`
   - append workspace tsconfig to `typecheck`

### Workstream B — Persistence and migration
1. Add category POD columns in extension migration
2. Replace stock-reduction DB function in same migration with POD-aware skip logic
3. Keep runtime behavior extension-owned; no direct core edits

### Workstream C — Admin category flow
1. Add `PrintOnDemandSettings.tsx` into category create/edit area
2. Extend category GraphQL/admin resolvers to return persisted POD fields
3. Add server-side create/update normalization and validation hooks

### Workstream D — Storefront read model
1. Add GraphQL schema + resolvers for category POD policy and product POD presentation
2. Build shared range formatter for:
   - min/max range
   - equal min/max single-value wording
   - unit localization

### Workstream E — Storefront surfaces
1. Override PDP query/rendering
2. Override category listing query/rendering
3. Override search listing query/rendering
4. Reuse one shared presentation contract so all CTA surfaces stay consistent

### Workstream F — Purchase-flow continuity
1. Extend cart item qty logic so out-of-stock POD-eligible items are not rejected
2. Add order validation rule for POD eligibility at checkout
3. Ensure order placement succeeds through standard flow
4. Ensure inventory is **not decremented** for POD-eligible out-of-stock order items

## Verification Strategy

### Required fixture matrix

Create at minimum:

- **POD Category A**: e.g. `5-7 days`
- **POD Category B**: e.g. `2-3 weeks`
- **Product A**: out of stock, assigned to Category A
- **Product B**: out of stock, assigned to Category B
- **Product C**: in stock, assigned to POD category
- **Product D**: out of stock, assigned to non-POD category

### Unit coverage

Must verify:

- category validation and normalization
- direct-category POD resolution
- equal/min-max label formatting
- Category A vs Category B range separation
- cart qty rule bypass only for out-of-stock POD-eligible items
- order validation success for POD-eligible out-of-stock items
- stock-decrement skip logic for POD-eligible out-of-stock order items

### E2E coverage

Must verify:

1. admin can save/reopen POD Category A
2. admin can save/reopen POD Category B
3. PDP for Product A shows `Print Now` + Category A range
4. PDP for Product B shows `Print Now` + Category B range
5. category/search list surfaces show the correct CTA/range for both products
6. Product A can be added to cart and successfully checked out to order placement
7. Product C keeps normal resale behavior
8. Product D keeps normal out-of-stock behavior

## Generated Output Workflow

After any source/schema changes in the new extension:

1. update `src/**`
2. run workspace compile via root entry point:
   - `npm run build:extensions`
3. confirm generated outputs are updated and committed:
   - `extensions/printelPrintOnDemand/dist/**`
   - copied GraphQL file under `extensions/printelPrintOnDemand/dist/graphql/types/PrintOnDemand/PrintOnDemand.graphql`
4. run full repo build:
   - `npm run build`

A change is incomplete if `src`, `dist`, and copied GraphQL artifacts are not all in sync.

## Validation Commands

- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run build`

## Post-Design Constitution Re-Check

PASS. The revised plan now explicitly covers:

- extension-first implementation
- Romanian/localized copy updates
- generated-output workflow with actual commands
- script-gated validation
- secure config handling
- full operational purchase-flow behavior, not just UI copy
