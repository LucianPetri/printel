export declare function sendDelayedOrderConfirmation(orderId: number, options?: {
    skipAnafRegistrationRequirement?: boolean;
}): Promise<boolean>;
