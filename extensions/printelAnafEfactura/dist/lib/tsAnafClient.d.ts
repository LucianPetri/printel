import { AnafEnvironment } from './anafStatuses.js';
import { AnafConnectionState } from './anafComplianceRepository.js';
export type SubmitInvoiceResult = {
    outcome: 'registered' | 'duplicate';
    registrationCode: string;
    uploadIndex: string;
    downloadId: string | null;
    raw: Record<string, unknown>;
    refreshedRefreshToken?: string;
} | {
    outcome: 'queued';
    failureCode: string;
    failureMessage: string;
    raw: Record<string, unknown>;
    refreshedRefreshToken?: string;
} | {
    outcome: 'blocked_auth';
    failureCode: string;
    failureMessage: string;
    raw: Record<string, unknown>;
    refreshedRefreshToken?: string;
};
export type AnafConnectionCheckResult = {
    ok: boolean;
    code: string;
    message: string;
    environment: AnafEnvironment;
    refreshedRefreshToken?: string;
};
export declare function getConnectionLabel(environment: AnafEnvironment, isConnected: boolean): string;
export declare function buildAnafAuthorizationUrl(environment: AnafEnvironment): string;
export declare function exchangeAnafAuthorizationCode(environment: AnafEnvironment, code: string): Promise<import("@florinszilagyi/anaf-ts-sdk").TokenResponse>;
export declare function checkAnafConnection({ environment, connectionState }: {
    environment: AnafEnvironment;
    connectionState: AnafConnectionState | null;
}): Promise<AnafConnectionCheckResult>;
export declare function submitInvoiceToAnaf({ invoiceXml, invoiceHash, environment, connectionState }: {
    invoiceXml: string;
    invoiceHash: string;
    environment: AnafEnvironment;
    connectionState: AnafConnectionState | null;
}): Promise<SubmitInvoiceResult>;
