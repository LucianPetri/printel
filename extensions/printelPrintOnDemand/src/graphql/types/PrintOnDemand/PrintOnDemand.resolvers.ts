import { select } from '@evershop/postgres-query-builder';
import {
  normalizePrintOnDemandPolicy,
  resolvePrintOnDemandPresentation
} from '../../../lib/printOnDemandPresentation.js';

type GraphqlContext = {
  pool: any;
  printOnDemandCategoryPolicyCache?: Map<number, Record<string, any> | null>;
};

async function loadCategoryPolicy(
  categoryId: number | null,
  context: GraphqlContext
): Promise<Record<string, any> | null> {
  if (!categoryId) {
    return null;
  }

  if (!context.printOnDemandCategoryPolicyCache) {
    context.printOnDemandCategoryPolicyCache = new Map();
  }

  if (!context.printOnDemandCategoryPolicyCache.has(categoryId)) {
    const category = await select()
      .from('category')
      .where('category_id', '=', categoryId)
      .load(context.pool);

    context.printOnDemandCategoryPolicyCache.set(categoryId, category ?? null);
  }

  return context.printOnDemandCategoryPolicyCache.get(categoryId) ?? null;
}

export default {
  Category: {
    printOnDemandPolicy: (category: Record<string, any>) =>
      normalizePrintOnDemandPolicy(category)
  },
  Product: {
    printOnDemandPresentation: async (
      product: Record<string, any>,
      _: unknown,
      context: GraphqlContext
    ) => {
      const categoryId = product.categoryId ?? product.category_id ?? null;
      const category = await loadCategoryPolicy(categoryId, context);
      return resolvePrintOnDemandPresentation(product, category);
    }
  }
};
