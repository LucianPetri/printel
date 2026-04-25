type GraphqlContext = {
    pool: any;
    printOnDemandCategoryPolicyCache?: Map<number, Record<string, any> | null>;
};
declare const _default: {
    Category: {
        printOnDemandPolicy: (category: Record<string, any>) => import("../../../lib/printOnDemandPresentation.js").PrintOnDemandPolicy;
    };
    Product: {
        printOnDemandPresentation: (product: Record<string, any>, _: unknown, context: GraphqlContext) => Promise<import("../../../lib/printOnDemandPresentation.js").PrintOnDemandPresentation>;
    };
};
export default _default;
