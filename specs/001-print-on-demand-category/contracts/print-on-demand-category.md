# Interface Contract: Print-on-Demand Category Delivery Behavior

## 1. Admin Category Form Contract

The category create/update form must submit the following additional fields:

| Field | Type | Required | Rules |
|---|---|---|---|
| `print_on_demand_enabled` | boolean | yes | Defaults to `false` |
| `print_on_demand_min` | integer | when enabled | `> 0` |
| `print_on_demand_max` | integer | when enabled | `> 0` and `>= min` |
| `print_on_demand_unit` | `days \| weeks` | when enabled | Must be one of the supported units |

### Server normalization

- If `print_on_demand_enabled = false`, the server clears `min`, `max`, and `unit`
- Invalid enabled payloads must fail save with a localized validation message

## 2. GraphQL Read Contract

```graphql
enum PrintOnDemandDeliveryUnit {
  days
  weeks
}

type PrintOnDemandDeliveryRange {
  min: Int!
  max: Int!
  unit: PrintOnDemandDeliveryUnit!
  label: String!
}

type CategoryPrintOnDemandPolicy {
  enabled: Boolean!
  deliveryRange: PrintOnDemandDeliveryRange
}

type ProductPrintOnDemandPresentation {
  applies: Boolean!
  purchasable: Boolean!
  ctaLabel: String!
  sourceCategoryId: Int
  deliveryRange: PrintOnDemandDeliveryRange
}

extend type Category {
  printOnDemandPolicy: CategoryPrintOnDemandPolicy!
}

extend type Product {
  printOnDemandPresentation: ProductPrintOnDemandPresentation!
}
```

## 3. Storefront Rendering Contract

When `product.printOnDemandPresentation.applies = true`:

- CTA label must render localized `Print Now`
- delivery promise must render the localized POD range
- add-to-cart interaction must remain enabled through the existing flow

When `applies = false`:

- storefront keeps existing add-to-cart and delivery behavior

## 4. Precedence Contract

- `sourceCategoryId` resolves from the product's assigned `category_id`
- No parent inheritance or multi-category conflict resolution is part of this release contract
