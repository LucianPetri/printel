import { select } from '@evershop/postgres-query-builder';
import { normalizePrintOnDemandPolicy, resolvePrintOnDemandPresentation } from '../../../lib/printOnDemandPresentation.js';
async function loadCategoryPolicy(categoryId, context) {
    var _a;
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
        context.printOnDemandCategoryPolicyCache.set(categoryId, category !== null && category !== void 0 ? category : null);
    }
    return (_a = context.printOnDemandCategoryPolicyCache.get(categoryId)) !== null && _a !== void 0 ? _a : null;
}
export default {
    Category: {
        printOnDemandPolicy: (category) => normalizePrintOnDemandPolicy(category)
    },
    Product: {
        printOnDemandPresentation: async (product, _, context) => {
            var _a, _b;
            const categoryId = (_b = (_a = product.categoryId) !== null && _a !== void 0 ? _a : product.category_id) !== null && _b !== void 0 ? _b : null;
            const category = await loadCategoryPolicy(categoryId, context);
            return resolvePrintOnDemandPresentation(product, category);
        }
    }
};
//# sourceMappingURL=PrintOnDemand.resolvers.js.map