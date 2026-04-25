# Feature Specification: Print-on-Demand Category Delivery Behavior

**Feature Branch**: `001-print-on-demand-category`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Add print-on-demand category behavior for 3D printed products. Categories need admin settings to mark a category as print on demand and configure an out-of-stock delivery range with min/max numeric values plus a unit selector (days/weeks). On the storefront, products in those categories should keep normal resale behavior when in stock, but when out of stock and their category is marked print on demand, replace the buy button label with \"Print Now\" and show the print-on-demand delivery range instead of the normal in-stock delivery range. Multiple print-on-demand categories may exist with different complexity and therefore different delivery ranges."

## Clarifications

### Session 2026-04-25

- Q: For out-of-stock products in enabled print-on-demand categories, does the existing purchase flow remain available? → A: Yes. Shoppers must still be able to order those products through the existing purchase flow; this feature changes the CTA label and delivery promise, not checkout availability.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure a print-on-demand category (Priority: P1)

As a store administrator, I can mark a category as print on demand and define its out-of-stock delivery range so that all products sold through that category inherit the correct made-to-order promise.

**Why this priority**: Category-level configuration is the source of truth for the entire feature. Without it, storefront behavior cannot be managed consistently across multiple 3D-printed product groups.

**Independent Test**: An administrator can edit a category, enable print-on-demand behavior, save a valid minimum and maximum delivery range with a unit, and later reopen the category to confirm the settings were retained.

**Acceptance Scenarios**:

1. **Given** an administrator is editing a category for 3D-printed products, **When** they enable print-on-demand behavior and save a minimum range, maximum range, and unit, **Then** the category stores those values and presents them again on subsequent edits.
2. **Given** an administrator enables print-on-demand behavior, **When** they enter invalid range data such as missing values, non-numeric values, negative values, or a minimum greater than the maximum, **Then** the category cannot be saved until the range is corrected.

---

### User Story 2 - Show print-on-demand purchase messaging for out-of-stock items (Priority: P2)

As a shopper viewing an out-of-stock product in a print-on-demand category, I see a "Print Now" purchase call to action and the category's print-on-demand delivery range so I understand the item can still be ordered and how long fulfillment should take.

**Why this priority**: This is the primary customer-facing value. It allows the storefront to continue selling made-to-order items instead of treating them like unavailable resale inventory.

**Independent Test**: A shopper can open an out-of-stock product assigned to an enabled print-on-demand category and confirm that the buy button label changes to "Print Now", the displayed delivery range matches that category's configured out-of-stock promise, and the product remains orderable through the existing purchase flow.

**Acceptance Scenarios**:

1. **Given** a product is out of stock and belongs to a category with print-on-demand enabled, **When** a shopper views the product purchase surface, **Then** the buy button label reads "Print Now" instead of the standard resale label.
2. **Given** a product is out of stock and belongs to a category with print-on-demand enabled, **When** a shopper views delivery timing, **Then** the storefront shows the category's configured out-of-stock print-on-demand range and unit instead of the normal in-stock delivery range.
3. **Given** two different print-on-demand categories have different configured ranges, **When** a shopper views out-of-stock products from each category, **Then** each product shows the delivery range configured for its own category.
4. **Given** a product is out of stock and belongs to a category with print-on-demand enabled, **When** a shopper uses the `Print Now` call to action, **Then** the product remains purchasable through the existing storefront purchase flow.

---

### User Story 3 - Preserve existing resale behavior outside the print-on-demand case (Priority: P3)

As a shopper, I continue to see the current purchase label and normal delivery promise for products that are in stock or not sold through a print-on-demand category, so only the intended products are affected.

**Why this priority**: The feature must be tightly scoped to avoid regressions in the existing resale purchase flow.

**Independent Test**: A shopper can compare in-stock print-on-demand-category products and non-print-on-demand products against current behavior and confirm there is no change to normal resale messaging.

**Acceptance Scenarios**:

1. **Given** a product belongs to a print-on-demand category but is currently in stock, **When** a shopper views the product purchase surface, **Then** the storefront keeps the standard resale buy label and the normal in-stock delivery range.
2. **Given** a product is out of stock but does not belong to a print-on-demand category, **When** a shopper views the product purchase surface, **Then** the storefront keeps the existing non-print-on-demand behavior with no "Print Now" label or print-on-demand delivery range.

### Edge Cases

- A category cannot be saved with print-on-demand enabled unless the minimum value, maximum value, and unit are all present and valid.
- If the minimum and maximum delivery values are identical, the storefront must display a clear single-range promise without conflicting wording.
- If print-on-demand is later disabled for a category, storefront products in that category must immediately revert to normal resale messaging.
- Categories without print-on-demand enabled must ignore any previously entered print-on-demand values.
- Products outside the dedicated print-on-demand category setup must remain unaffected even if they are out of stock.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow administrators to mark any product category as print on demand.
- **FR-002**: The system MUST allow administrators to define an out-of-stock delivery range for each print-on-demand category using a minimum numeric value, a maximum numeric value, and a unit selector with the options `days` and `weeks`.
- **FR-003**: The system MUST validate print-on-demand delivery inputs before saving, including requiring numeric values greater than zero and preventing a minimum value that exceeds the maximum value.
- **FR-004**: The system MUST persist print-on-demand settings at the category level so they remain available in future admin edits and can be used by storefront product presentation.
- **FR-005**: The system MUST apply print-on-demand storefront behavior only when a product is both out of stock and assigned to a category with print-on-demand enabled.
- **FR-006**: When print-on-demand storefront behavior applies, the system MUST replace the standard buy button label with `Print Now`.
- **FR-007**: When print-on-demand storefront behavior applies, the system MUST display the configured print-on-demand out-of-stock delivery range instead of the normal in-stock delivery range.
- **FR-008**: Products in print-on-demand categories that are currently in stock MUST continue to use the existing resale buy button label and normal in-stock delivery messaging.
- **FR-009**: Products not assigned to print-on-demand categories MUST continue to use the existing purchase and delivery behavior regardless of stock state.
- **FR-010**: The system MUST support multiple print-on-demand categories with independently configured delivery ranges and must show each product the range associated with its category.
- **FR-011**: The system MUST prevent incomplete or invalid print-on-demand category settings from creating customer-visible print-on-demand messaging.
- **FR-012**: Customer-facing and admin-facing text introduced by this feature MUST be localizable, including the `Print Now` label, delivery-range wording, and category-setting labels or validation messages.
- **FR-013**: Out-of-stock products in categories with print-on-demand enabled MUST remain purchasable through the existing storefront purchase flow; this feature changes customer-facing purchase messaging and delivery promises without introducing a separate checkout path.

### Compliance, Localization & Operational Constraints

- Touched delivery surfaces are expected to include `config/`, affected `extensions/*`, generated `dist/`, `translations/`, and `tests/`.
- This feature changes customer-visible storefront messaging but does not change pricing, consent, privacy, or legal policy. Romanian must remain the default experience for any new storefront or admin text, and all already-supported locales must receive equivalent translations for the new label, delivery-range wording, setting labels, and validation messages.
- No CMS page changes are required unless the current storefront exposes delivery guidance through editable content that must remain consistent with the new category-based promise.
- The feature requires persisted category-level settings for a print-on-demand flag, out-of-stock delivery minimum, out-of-stock delivery maximum, and out-of-stock delivery unit. These settings must be retrievable in both admin category management flows and storefront product presentation flows.
- Existing categories and products without the new settings must continue to behave exactly as they do today.
- Validation commands for this feature are `npm run lint`, `npm run test:unit`, `npm run test:e2e`, and `npm run build`.

### Key Entities *(include if feature involves data)*

- **Category Print-on-Demand Policy**: Category-owned merchandising rules that determine whether out-of-stock products may be sold as print on demand and what delivery range should be promised.
- **Print-on-Demand Delivery Range**: A category-level fulfillment promise composed of a minimum value, maximum value, and a time unit used only when the related product is out of stock.
- **Product Availability Presentation**: The customer-facing purchase label and delivery promise shown for a product based on stock state and whether its category has an active print-on-demand policy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, a store administrator can configure or update print-on-demand settings for a category in under 1 minute without needing manual support.
- **SC-002**: In acceptance testing, 100% of reviewed out-of-stock products in enabled print-on-demand categories display the `Print Now` label and the category-specific print-on-demand delivery range.
- **SC-003**: In regression testing, 100% of reviewed in-stock products and non-print-on-demand products retain their current purchase label and normal delivery messaging.
- **SC-004**: During user acceptance testing, the merchandising team can manage at least three print-on-demand categories with different delivery ranges without conflicting storefront promises.

## Assumptions

- Existing stock status remains the source of truth for whether a product is treated as in stock or out of stock.
- The intended 3D-printed catalog is organized under dedicated categories so category-owned behavior can determine the storefront promise for affected products.
- Existing normal in-stock resale delivery messaging, commonly 1-4 days today, remains unchanged and continues to appear whenever inventory is available.
- The new `Print Now` label is required anywhere the standard buy button label is shown for the affected out-of-stock print-on-demand state.
- This feature does not introduce new pricing rules, custom order approvals, or shopper-selected production options in its first release.
