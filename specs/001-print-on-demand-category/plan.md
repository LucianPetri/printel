# Implementation Plan: Print-on-Demand Category Delivery Behavior

**Branch**: `001-print-on-demand-category` | **Date**: 2026-04-25 | **Spec**: `/home/xaiko/apps/printel/specs/001-print-on-demand-category/spec.md`
**Input**: Feature specification from `/home/xaiko/apps/printel/specs/001-print-on-demand-category/spec.md`

## Summary

Implement the feature as a dedicated EverShop extension workspace, `extensions/printelPrintOnDemand`, that stores print-on-demand policy on categories, adds an admin category settings card, extends category/product GraphQL read models, overrides storefront product purchase messaging for eligible out-of-stock products, and adds POD-aware cart validation so the existing purchase flow stays usable. The effective policy is resolved from the product's assigned `category_id`, which is the only category linkage exposed by the current Printel catalog/admin model.

## Technical Context

**Language/Version**: TypeScript 6, Node.js ESM, React 19  
**Primary Dependencies**: `@evershop/evershop` 2.1.2, React, react-hook-form, `@evershop/postgres-query-builder`  
**Storage**: PostgreSQL (`category`, `product`, `product_inventory`, checkout triggers), JSON translation files under `translations/`  
**Testing**: `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run build`  
**Target Platform**: Linux-hosted EverShop storefront and admin web application  
**Project Type**: Extension-based e-commerce web application  
**Performance Goals**: Preserve existing admin/product page responsiveness; keep POD resolution to one category lookup per product surface and avoid extra shopper-facing network hops beyond page GraphQL loads  
**Constraints**: Extension-first delivery; `src` and `dist` must stay in sync; Romanian is the release gate for new copy; existing checkout path must remain the only order path; current product assignment is a single `category_id`; no new secrets or env vars  
**Scale/Scope**: One new feature extension workspace, root workspace/config updates, category schema migration, storefront/admin UI wiring, translations, unit coverage, and one focused E2E flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

- [x] Extension-first scope identified: `config/default.json`, `package.json`, `extensions/printelPrintOnDemand/*`, generated `extensions/printelPrintOnDemand/dist/*`, `translations/*`, `tests/*`
- [x] Romanian/compliance impact reviewed: shopper/admin copy changes require Romanian and English translations; no pricing/privacy/legal/ANPC/cookie policy changes are expected
- [x] `src` to `dist` compile path identified: new workspace compiles via `npm run build:extensions`, with copied GraphQL schema files committed in `dist/`
- [x] Validation commands listed via repository entry points: `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run build`
- [x] Config and secret handling documented: committed changes stay in `config/*.json`, workspace sources, migrations, tests, and translations only; no secret material added

**Post-design review**: PASS. The design stays inside EverShop extension seams, keeps Romanian translation coverage explicit, and does not require constitution exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/001-print-on-demand-category/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── print-on-demand-category.md
└── tasks.md                # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
config/
└── default.json

package.json

extensions/
├── printelTheme/
├── printelCookieBanner/
├── printelLegalFooter/
└── printelPrintOnDemand/
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── bootstrap.ts
    │   ├── migration/
    │   │   └── Version-1.0.0.ts
    │   ├── graphql/
    │   │   └── types/
    │   │       └── PrintOnDemand/
    │   │           ├── PrintOnDemand.graphql
    │   │           └── PrintOnDemand.resolvers.ts
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   └── categoryEdit+categoryNew/
    │   │   │       └── PrintOnDemandSettings.tsx
    │   │   └── frontStore/
    │   │       └── productView/
    │   │           ├── ProductView.tsx
    │   │           └── ProductSingleForm.tsx
    │   └── shared/
    │       └── printOnDemandPresentation.ts
    └── dist/

tests/
├── unit/
│   └── print-on-demand-category-resolver.test.mjs
└── e2e/
    └── print-on-demand-category.spec.ts

translations/
├── en/
│   ├── admin.json
│   └── messages.json
└── ro/
    ├── admin.json
    └── messages.json
```

**Structure Decision**: Use a dedicated `printelPrintOnDemand` workspace because the feature spans migration, GraphQL, admin, storefront, and checkout validation seams. Keep the theme workspace untouched unless styling-only follow-up work is needed, and update root workspace scripts/config so the new extension compiles and loads with the existing extension set.

## Phase 0: Research Summary

1. **Persistence strategy**: Add category-owned POD columns directly to `category` because the fields are non-localized operational policy, not CMS copy.
2. **Validation strategy**: Enforce the same min/max/unit rules in both admin UI and server-side category processors so invalid values cannot leak into customer-visible presentation.
3. **Storefront read strategy**: Extend product/category GraphQL with a derived POD presentation object so product page components consume one resolved contract instead of duplicating business rules.
4. **Purchase-flow strategy**: Change both storefront CTA rendering and checkout/cart validation; UI-only relabeling is insufficient because base `AddToCart` and cart item stock rules currently block out-of-stock purchases.
5. **Precedence strategy**: Resolve the effective POD policy from the product's assigned `category_id` only. The current admin/catalog model exposes a single product category, so multi-category conflict resolution is intentionally out of scope unless catalog assignment rules change.

## Phase 1: Design Summary

### Data Model

- Add nullable category columns:
  - `print_on_demand_enabled BOOLEAN NOT NULL DEFAULT FALSE`
  - `print_on_demand_min INT`
  - `print_on_demand_max INT`
  - `print_on_demand_unit VARCHAR(16)` constrained to `days|weeks`
- Server normalization rules:
  - when disabled, clear min/max/unit to `NULL`
  - when enabled, require all three fields
  - min/max must be positive integers and `min <= max`
- Derived product read model:
  - `applies`: true only when product is out of stock and assigned category has POD enabled
  - `ctaLabel`: `Print Now` when `applies`, otherwise existing label
  - `deliveryRange`: resolved category range when `applies`, otherwise null/standard storefront behavior
  - `purchasable`: true for POD-eligible out-of-stock products because the existing add-to-cart flow remains active

### Admin Surfaces

- Add `PrintOnDemandSettings.tsx` under `pages/admin/categoryEdit+categoryNew/` as a new category-edit card.
- Fields:
  - enable toggle
  - minimum value
  - maximum value
  - unit selector (`days`, `weeks`)
- Query the current category policy through an extended Category GraphQL type.
- Client behavior:
  - hide/disable range inputs until the toggle is enabled
  - show inline validation for required/positive/min-max ordering
- Server behavior:
  - extend category create/update schema/processors in `bootstrap.ts`
  - reject invalid payloads even if a crafted request bypasses the UI

### Storefront Behavior Wiring

- Override product-view query/components in the new extension so `useProduct()` receives the derived POD presentation contract.
- In `ProductSingleForm`:
  - keep quantity input and add-to-cart interaction available for POD-eligible out-of-stock products
  - swap the CTA label to localized `Print Now`
  - show localized POD delivery copy built from category min/max/unit
  - preserve existing labels and delivery behavior for in-stock products and non-POD products
- Reuse a shared formatter/helper to render identical ranges cleanly (for example, `2 weeks` instead of `2-2 weeks`) and to support Romanian/English copy consistently.
- Ensure the same derived contract can be reused for any later list-card CTA surfaces if catalog/product-card add-to-cart buttons must also change.

### Checkout / Cart Behavior

- Base EverShop currently blocks out-of-stock add-to-cart twice:
  - front-end `AddToCart` computes `canAddToCart` from `product.isInStock`
  - checkout cart item base fields reject qty when managed stock is below requested qty
- The extension therefore must add POD-aware cart rules, not just product-page copy:
  - override/add a POD-aware add-to-cart component state contract
  - extend cart item field processing so eligible POD products bypass the default out-of-stock rejection while remaining on the same cart/checkout path

### Category Precedence Handling

- **Chosen rule for this release**: the product's assigned `category_id` is authoritative for POD behavior.
- **Implications**:
  - different POD categories with different ranges are supported across products
  - no parent-category inheritance is planned in v1
  - no multi-category conflict logic is implemented because current product admin/catalog wiring is single-category

### Validation & Coverage

- Unit tests:
  - category/product POD resolver output
  - delivery range formatting and identical min/max rendering
  - validation normalization when disabling POD
- E2E:
  - admin config save/edit round-trip
  - out-of-stock POD product shows `Print Now`, shows POD promise, and remains orderable
  - in-stock POD-category product stays unchanged
  - out-of-stock non-POD product stays unchanged
- Build validation:
  - root scripts updated so `npm run lint`, `npm run test:unit`, and `npm run build` include the new workspace compile path

## Risks / Gate Decisions

1. **Checkout stock semantics**: permitting POD purchases for out-of-stock items requires a deliberate decision on inventory decrement behavior at order placement. The current trigger always subtracts ordered qty for managed-stock products, which may drive POD items negative unless explicitly adjusted.
2. **Catalog discoverability**: if the business expects out-of-stock POD items to remain visible in listing/search surfaces, confirm the current `showOutOfStockProduct` behavior is acceptable; this plan only guarantees correct messaging on product purchase surfaces.
3. **Future multi-category scope**: if merchandising later requires a product to belong to multiple categories with conflicting POD policies, the current single-category rule must be revisited before implementation expands.

## Complexity Tracking

No constitution violations or justified exceptions identified.
