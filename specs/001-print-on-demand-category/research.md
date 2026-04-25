# Phase 0 Research: Print-on-Demand Category Delivery Behavior

## Decision 1: Ship the feature in a dedicated extension workspace

- **Decision**: Create `extensions/printelPrintOnDemand` instead of folding the feature into `printelTheme` or editing EverShop core files.
- **Rationale**: The feature spans migration, GraphQL, admin page injection, storefront override, and checkout/cart validation. Existing Printel customizations already package non-core behavior as extensions, and the constitution requires extension-first delivery with committed `dist/` outputs.
- **Alternatives considered**:
  - **Reuse `printelTheme`**: rejected because the feature is not purely presentation; it needs schema and runtime hooks.
  - **Patch EverShop core under `node_modules`**: rejected because it violates extension-first delivery and is not reproducible.

## Decision 2: Persist POD policy directly on the `category` table

- **Decision**: Add `print_on_demand_enabled`, `print_on_demand_min`, `print_on_demand_max`, and `print_on_demand_unit` columns to `category`.
- **Rationale**: These values are category-owned operational policy, not localized prose. Keeping them on `category` makes admin save/load and storefront lookup straightforward and avoids special settings indirection.
- **Alternatives considered**:
  - **`setting` table rows**: rejected because settings are global, not category-scoped.
  - **`category_description` columns**: rejected because the values are not locale-specific.

## Decision 3: Enforce validation in both admin UI and server processors

- **Decision**: Add inline form validation and mirror the same rules in extension bootstrap processors for category create/update payloads.
- **Rationale**: UI validation improves admin usability, but server-side rules are required to prevent invalid saved data and customer-visible bad promises. Disabling POD must also null out stale range values.
- **Alternatives considered**:
  - **Client validation only**: rejected because crafted requests could bypass the UI.
  - **Server validation only**: rejected because it degrades admin feedback and makes form correction slower.

## Decision 4: Expose a derived POD presentation contract on Product

- **Decision**: Extend GraphQL/read models with a derived product POD presentation object instead of duplicating category + inventory logic inside each storefront component.
- **Rationale**: Product surfaces only need to know whether POD applies, which CTA label to show, whether the item remains purchasable, and what delivery promise to render. A derived contract centralizes business rules and keeps UI overrides thin.
- **Alternatives considered**:
  - **Compute eligibility separately in each component**: rejected because product page and future list surfaces would drift.
  - **Query raw category fields only**: rejected because UI code would need to repeat stock and precedence logic.

## Decision 5: Treat the assigned `category_id` as the only precedence source

- **Decision**: Resolve POD behavior from the product's assigned `category_id` only for v1.
- **Rationale**: Printel's current catalog/admin flow exposes a single product category assignment, and the current product/category resolvers operate on that direct link. This supports multiple POD categories across the catalog while keeping the rule deterministic.
- **Alternatives considered**:
  - **Parent-category inheritance**: rejected for v1 because the spec does not require it and it would blur which range wins.
  - **Multi-category conflict resolution**: rejected because the current product model does not expose multiple active category assignments in the working admin/storefront flow.

## Decision 6: Change checkout/cart validation, not just storefront copy

- **Decision**: Plan explicit POD-aware cart validation changes alongside storefront CTA relabeling.
- **Rationale**: Base EverShop blocks out-of-stock purchases in both the front-end add-to-cart state and cart item stock validation. Without checkout-side changes, the feature would show `Print Now` but still fail to order.
- **Alternatives considered**:
  - **Only override product page button text**: rejected because it would not satisfy FR-013.
  - **Set products to unmanaged stock**: rejected because it would also make in-stock behavior inaccurate and is not category-scoped.

## Open Research Notes

- The order-placement stock decrement trigger currently subtracts qty for managed-stock products unconditionally. Implementation must either accept negative inventory for POD orders or add a POD-aware adjustment rule; this is the main gate decision left for implementation.
