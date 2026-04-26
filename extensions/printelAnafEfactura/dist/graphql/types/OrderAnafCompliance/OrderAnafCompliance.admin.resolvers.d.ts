type GraphqlContext = {
    orderAnafComplianceCache?: Map<number, any>;
};
declare const _default: {
    Order: {
        anafCompliance: (order: Record<string, any>, _: unknown, context: GraphqlContext) => Promise<any>;
    };
};
export default _default;
