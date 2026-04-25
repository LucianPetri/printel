import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
import { addProcessor } from '@evershop/evershop/lib/util/registry';
import { addOrderValidationRule } from '@evershop/evershop/checkout/services';
import {
  buildPrintOnDemandPayload,
  normalizePrintOnDemandPolicy,
  resolvePrintOnDemandPresentation
} from './lib/printOnDemandPresentation.js';

async function loadCategory(categoryId: number | null) {
  if (!categoryId) {
    return null;
  }

  return await select()
    .from('category')
    .where('category_id', '=', categoryId)
    .load(pool);
}

async function isPrintOnDemandEligibleProduct(product: Record<string, any>) {
  const category = await loadCategory(product.category_id ?? product.categoryId ?? null);
  return resolvePrintOnDemandPresentation(product, category).applies;
}

function registerPrintOnDemandQtyField(fields: Record<string, any>[]) {
  return fields.concat([
    {
      key: 'qty',
      dependencies: ['product_id', 'category_id'],
      resolvers: [
        async function printOnDemandQtyResolver(this: any, value: number) {
          const product = await this.getProduct();
          const isEligible = await isPrintOnDemandEligibleProduct(product);
          if (isEligible) {
            this.setError('qty', null);
          }
          return value;
        }
      ]
    }
  ]);
}

function normalizeCategoryPayload(data: Record<string, any>) {
  return buildPrintOnDemandPayload(data, { allowMissing: true });
}

export default () => {
  addProcessor('categoryDataBeforeCreate', normalizeCategoryPayload, 10);
  addProcessor('categoryDataBeforeUpdate', normalizeCategoryPayload, 10);
  addProcessor('cartItemFields', registerPrintOnDemandQtyField, 10);

  addOrderValidationRule({
    id: 'printOnDemandEligibility',
    func: async (cart) => {
      const items = cart.getItems();

      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const product = await item.getProduct();
        const requestedQty = Number.parseInt(String(item.getData('qty')), 10) || 0;
        const inStockQty = Number.parseInt(String(product.qty ?? 0), 10) || 0;
        const policy = normalizePrintOnDemandPolicy(
          await loadCategory(product.category_id ?? product.categoryId ?? null)
        );

        if (inStockQty < 1) {
          if (!resolvePrintOnDemandPresentation(product, policy).applies) {
            return false;
          }
          continue;
        }

        if (
          (product.manage_stock === true || product.manageStock === true) &&
          inStockQty < requestedQty
        ) {
          return false;
        }
      }

      return true;
    },
    errorMessage:
      'One or more products are no longer eligible for print on demand checkout.'
  });
};
