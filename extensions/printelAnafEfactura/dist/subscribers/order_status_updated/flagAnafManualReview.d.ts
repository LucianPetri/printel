export default function flagAnafManualReview(data: {
    orderId: number;
    before: string;
    after: string;
}): Promise<void>;
