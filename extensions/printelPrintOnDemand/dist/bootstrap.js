import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
import { addProcessor } from '@evershop/evershop/lib/util/registry';
import { addOrderValidationRule } from '@evershop/evershop/checkout/services';
import { buildPrintOnDemandPayload, normalizePrintOnDemandPolicy, resolvePrintOnDemandPresentation } from './lib/printOnDemandPresentation.js';
async function loadCategory(categoryId) {
    if (!categoryId) {
        return null;
    }
    return await select()
        .from('category')
        .where('category_id', '=', categoryId)
        .load(pool);
}
async function isPrintOnDemandEligibleProduct(product) {
    var _a, _b;
    const category = await loadCategory((_b = (_a = product.category_id) !== null && _a !== void 0 ? _a : product.categoryId) !== null && _b !== void 0 ? _b : null);
    return resolvePrintOnDemandPresentation(product, category).applies;
}
function registerPrintOnDemandQtyField(fields) {
    return fields.concat([
        {
            key: 'qty',
            dependencies: ['product_id', 'category_id'],
            resolvers: [
                async function printOnDemandQtyResolver(value) {
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
function normalizeCategoryPayload(data) {
    return buildPrintOnDemandPayload(data, { allowMissing: true });
}
export default () => {
    addProcessor('categoryDataBeforeCreate', normalizeCategoryPayload, 10);
    addProcessor('categoryDataBeforeUpdate', normalizeCategoryPayload, 10);
    addProcessor('cartItemFields', registerPrintOnDemandQtyField, 10);
    addOrderValidationRule({
        id: 'printOnDemandEligibility',
        func: async (cart) => {
            var _a, _b, _c;
            const items = cart.getItems();
            for (let index = 0; index < items.length; index += 1) {
                const item = items[index];
                const product = await item.getProduct();
                const requestedQty = Number.parseInt(String(item.getData('qty')), 10) || 0;
                const inStockQty = Number.parseInt(String((_a = product.qty) !== null && _a !== void 0 ? _a : 0), 10) || 0;
                const policy = normalizePrintOnDemandPolicy(await loadCategory((_c = (_b = product.category_id) !== null && _b !== void 0 ? _b : product.categoryId) !== null && _c !== void 0 ? _c : null));
                if (inStockQty < 1) {
                    if (!resolvePrintOnDemandPresentation(product, policy).applies) {
                        return false;
                    }
                    continue;
                }
                if ((product.manage_stock === true || product.manageStock === true) &&
                    inStockQty < requestedQty) {
                    return false;
                }
            }
            return true;
        },
        errorMessage: 'One or more products are no longer eligible for print on demand checkout.'
    });
};
//# sourceMappingURL=bootstrap.js.map