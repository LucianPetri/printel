# Data Model: Print-on-Demand Category Delivery Behavior

## 1. CategoryPrintOnDemandPolicy

**Purpose**: Persist category-owned print-on-demand rules used by admin editing and storefront presentation.

### Fields

| Field | Type | Source | Required | Notes |
|---|---|---|---|---|
| `category_id` | `INT` | existing `category` PK | yes | One policy per category |
| `print_on_demand_enabled` | `BOOLEAN` | new `category` column | yes | Defaults to `false` |
| `print_on_demand_min` | `INT` | new `category` column | conditional | Required when enabled |
| `print_on_demand_max` | `INT` | new `category` column | conditional | Required when enabled |
| `print_on_demand_unit` | `VARCHAR(16)` | new `category` column | conditional | `days` or `weeks` |

### Validation Rules

- When `print_on_demand_enabled = false`, `min`, `max`, and `unit` must be stored as `NULL`.
- When `print_on_demand_enabled = true`:
  - `print_on_demand_min` and `print_on_demand_max` must be positive integers
  - `print_on_demand_unit` must be `days` or `weeks`
  - `print_on_demand_min <= print_on_demand_max`

### Relationships

- Belongs to exactly one `Category`
- Is referenced by derived `ProductPrintOnDemandPresentation`

### State Transitions

| From | To | Trigger |
|---|---|---|
| Disabled | Enabled | Admin enables POD and saves valid range |
| Enabled | Disabled | Admin disables POD; persisted range data is nulled |
| Enabled | Enabled | Admin edits min/max/unit with valid values |

## 2. PrintOnDemandDeliveryRange

**Purpose**: Value object used by admin validation and storefront display.

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `min` | `INT` | yes | Positive integer |
| `max` | `INT` | yes | Positive integer |
| `unit` | `ENUM(days,weeks)` | yes | Localized in UI |
| `label` | derived `STRING` | no | Localized display string, including identical min/max normalization |

## 3. ProductPrintOnDemandPresentation

**Purpose**: Derived read model for storefront purchase messaging.

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `product_id` | `INT` | yes | Existing product identifier |
| `source_category_id` | `INT \| NULL` | no | Assigned category used for resolution |
| `applies` | `BOOLEAN` | yes | True only for out-of-stock products whose assigned category has POD enabled |
| `cta_label` | `STRING` | yes | `Print Now` when `applies`, otherwise existing label |
| `delivery_range` | `PrintOnDemandDeliveryRange \| NULL` | no | Present only when `applies` |
| `purchasable` | `BOOLEAN` | yes | Must remain `true` for POD-eligible out-of-stock products |

### Resolution Rules

1. Load the product's assigned `category_id`
2. Load category POD policy
3. Check `product.inventory.isInStock`
4. If category POD is enabled and stock is out:
   - `applies = true`
   - `cta_label = "Print Now"`
   - `delivery_range = category policy range`
   - `purchasable = true`
5. Otherwise, preserve current storefront behavior

## 4. CartItemPODEligibility

**Purpose**: Derived checkout-side rule used to bypass normal out-of-stock rejection for eligible POD products.

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `product_id` | `INT` | yes | Existing cart item product |
| `eligible_for_pod_checkout` | `BOOLEAN` | yes | Mirrors `ProductPrintOnDemandPresentation.applies` at add-to-cart time |
| `stock_decrement_mode` | derived enum | yes | `standard` or `pod-backorder-like` |

### Notes

- This is not planned as a persisted table in v1.
- It exists to make the cart/order pipeline explicit in the design because FR-013 changes checkout semantics, not just display copy.
