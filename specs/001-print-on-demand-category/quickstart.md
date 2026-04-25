# Quickstart: Print-on-Demand Category Delivery Behavior

## Prerequisites

- Repository dependencies installed
- Local database available through the existing Printel/EverShop setup
- Admin user available for category edits and storefront verification

## Implementation Setup

1. Add a new workspace: `extensions/printelPrintOnDemand`
2. Update root scripts in `package.json` so the new workspace is included in:
   - `build:extensions`
   - `typecheck`
3. Register the extension in `config/default.json`
4. Add the category migration and GraphQL schema/resolver copies to the workspace compile script

## Local Verification Flow

1. Build extensions:
   - `npm run build:extensions`
2. Start the app:
   - `npm run dev`
3. In admin:
   - open a category
   - enable print on demand
   - save min/max/unit
   - reopen the category and confirm values persist
4. On storefront:
   - view an out-of-stock product in that category
   - confirm the CTA reads `Print Now`
   - confirm the POD delivery range is shown
   - confirm add-to-cart / cart flow still works
5. Regression-check:
   - in-stock product in the same category remains unchanged
   - out-of-stock product outside POD categories remains unchanged

## Required Validation Commands

- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run build`

## Test Data Notes

- At least one category must be configured with POD enabled
- At least one product in that category must be out of stock
- At least one comparison product should remain in stock or outside POD categories

## Release Checklist

- Romanian and English translations added for admin + storefront copy
- Generated `dist/` files committed for the new extension
- Category save validation verified for invalid min/max/unit combinations
- Checkout behavior for POD-eligible out-of-stock products confirmed end-to-end
