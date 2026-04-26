import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { translate } from '@evershop/evershop/lib/locale/translate/translate';
import { decryptAnafToken } from './tokenCipher.js';
const require = createRequire(import.meta.url);
const { AnafAuthenticator, EfacturaClient, ExecutionStatus, TokenManager, UploadStatusValue } = require('@florinszilagyi/anaf-ts-sdk');
function buildDeterministicRegistrationCode(seed) {
    return `RO-${crypto.createHash('sha1').update(seed).digest('hex').slice(0, 12).toUpperCase()}`;
}
function getSimulationMode() {
    var _a;
    return String((_a = process.env.ANAF_SIMULATION_MODE) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
}
function getAuthenticator(environment) {
    const clientId = process.env.ANAF_CLIENT_ID;
    const clientSecret = process.env.ANAF_CLIENT_SECRET;
    const redirectUri = process.env.ANAF_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error(`ANAF OAuth configuration is incomplete for ${environment}. Set ANAF_CLIENT_ID, ANAF_CLIENT_SECRET, and ANAF_REDIRECT_URI.`);
    }
    return new AnafAuthenticator({
        clientId,
        clientSecret,
        redirectUri
    });
}
function createSdkClients(connectionState, environment) {
    const refreshToken = decryptAnafToken(connectionState.encrypted_refresh_token || '');
    const authenticator = getAuthenticator(environment);
    const tokenManager = new TokenManager(authenticator, refreshToken);
    const vatNumber = String(connectionState.company_tax_id || '').trim();
    if (!vatNumber) {
        throw new Error('The ANAF company tax identifier is missing from the active connection.');
    }
    return {
        tokenManager,
        client: new EfacturaClient({
            vatNumber,
            testMode: environment === 'test'
        }, tokenManager)
    };
}
function looksLikeAuthError(message) {
    return /(token|oauth|unauthori|auth|forbidden|expired|refresh)/i.test(message);
}
function looksLikeDuplicateError(message) {
    return /(duplicate|duplicat|already|exista deja|exists already)/i.test(message);
}
function buildBlockedAuthResult(environment, failureCode, failureMessage, raw, refreshedRefreshToken) {
    return {
        outcome: 'blocked_auth',
        failureCode,
        failureMessage,
        raw: { environment, ...raw },
        refreshedRefreshToken
    };
}
function buildQueuedResult(environment, failureCode, failureMessage, raw, refreshedRefreshToken) {
    return {
        outcome: 'queued',
        failureCode,
        failureMessage,
        raw: { environment, ...raw },
        refreshedRefreshToken
    };
}
export function getConnectionLabel(environment, isConnected) {
    if (!isConnected) {
        return translate('Disconnected');
    }
    return translate(environment === 'prod' ? 'Connected to live ANAF' : 'Connected to sandbox ANAF');
}
export function buildAnafAuthorizationUrl(environment) {
    const authenticator = getAuthenticator(environment);
    return authenticator.getAuthorizationUrl('efactura');
}
export async function exchangeAnafAuthorizationCode(environment, code) {
    if (!String(code || '').trim()) {
        throw new Error('Missing ANAF authorization code.');
    }
    const authenticator = getAuthenticator(environment);
    return await authenticator.exchangeCodeForToken(code);
}
export async function checkAnafConnection({ environment, connectionState }) {
    const simulationMode = getSimulationMode();
    if (!(connectionState === null || connectionState === void 0 ? void 0 : connectionState.encrypted_refresh_token)) {
        return {
            ok: false,
            code: 'missing_connection',
            message: translate('Connect the ANAF profile before automatic submissions can run.'),
            environment
        };
    }
    if (simulationMode === 'auth') {
        return {
            ok: false,
            code: 'auth_failed',
            message: translate('The ANAF sandbox token is invalid or expired.'),
            environment
        };
    }
    if (simulationMode === 'outage') {
        return {
            ok: false,
            code: 'anaf_unavailable',
            message: translate('ANAF sandbox is currently unavailable.'),
            environment
        };
    }
    if (simulationMode === 'success') {
        return {
            ok: true,
            code: 'connected',
            message: getConnectionLabel(environment, true),
            environment
        };
    }
    try {
        const { tokenManager } = createSdkClients(connectionState, environment);
        await tokenManager.getValidAccessToken();
        return {
            ok: true,
            code: 'connected',
            message: getConnectionLabel(environment, true),
            environment,
            refreshedRefreshToken: tokenManager.getRefreshToken()
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'ANAF connection check failed.';
        if (looksLikeAuthError(message)) {
            return {
                ok: false,
                code: 'auth_failed',
                message,
                environment
            };
        }
        return {
            ok: false,
            code: 'anaf_unavailable',
            message,
            environment
        };
    }
}
export async function submitInvoiceToAnaf({ invoiceXml, invoiceHash, environment, connectionState }) {
    var _a, _b, _c, _d;
    const simulationMode = getSimulationMode();
    if (!(connectionState === null || connectionState === void 0 ? void 0 : connectionState.encrypted_refresh_token)) {
        return {
            outcome: 'blocked_auth',
            failureCode: 'missing_connection',
            failureMessage: translate('ANAF is not connected for the selected legal entity.'),
            raw: { environment }
        };
    }
    if (simulationMode === 'auth') {
        return buildBlockedAuthResult(environment, 'auth_failed', translate('The ANAF authorization must be renewed before retrying queued invoices.'), {});
    }
    if (simulationMode === 'outage' || simulationMode === 'delayed') {
        return buildQueuedResult(environment, 'anaf_unavailable', translate('ANAF accepted the retry request later than the storefront timeout window.'), { uploadIndex: invoiceHash.slice(0, 12) });
    }
    if (simulationMode === 'duplicate') {
        return {
            outcome: 'duplicate',
            registrationCode: buildDeterministicRegistrationCode(invoiceHash),
            uploadIndex: invoiceHash.slice(0, 12),
            downloadId: null,
            raw: { environment, duplicate: true }
        };
    }
    const { tokenManager, client } = createSdkClients(connectionState, environment);
    try {
        const upload = await client.uploadDocument(invoiceXml, {
            standard: 'UBL',
            executare: true
        });
        const refreshedRefreshToken = tokenManager.getRefreshToken();
        if (upload.executionStatus === ExecutionStatus.Error) {
            const failureMessage = ((_a = upload.errors) === null || _a === void 0 ? void 0 : _a.join('; ')) || 'ANAF rejected the invoice upload.';
            if (looksLikeAuthError(failureMessage)) {
                return buildBlockedAuthResult(environment, 'auth_failed', failureMessage, { upload }, refreshedRefreshToken);
            }
            if (looksLikeDuplicateError(failureMessage)) {
                return {
                    outcome: 'duplicate',
                    registrationCode: upload.indexIncarcare || buildDeterministicRegistrationCode(invoiceHash),
                    uploadIndex: upload.indexIncarcare || invoiceHash.slice(0, 12),
                    downloadId: null,
                    raw: { environment, upload },
                    refreshedRefreshToken
                };
            }
            return buildQueuedResult(environment, 'upload_rejected', failureMessage, { upload }, refreshedRefreshToken);
        }
        const uploadIndex = upload.indexIncarcare;
        if (!uploadIndex) {
            return buildQueuedResult(environment, 'missing_upload_index', translate('ANAF accepted the upload request but did not return an upload index.'), { upload }, refreshedRefreshToken);
        }
        const status = await client.getUploadStatus(uploadIndex);
        if (status.stare === UploadStatusValue.InProgress) {
            return buildQueuedResult(environment, 'processing', translate('ANAF is still processing the uploaded invoice.'), { upload, status }, refreshedRefreshToken);
        }
        if (status.stare === UploadStatusValue.Failed) {
            const failureMessage = ((_b = status.errors) === null || _b === void 0 ? void 0 : _b.join('; ')) ||
                translate('ANAF reported an error while processing the invoice.');
            if (looksLikeAuthError(failureMessage)) {
                return buildBlockedAuthResult(environment, 'auth_failed', failureMessage, { upload, status }, refreshedRefreshToken);
            }
            if (looksLikeDuplicateError(failureMessage)) {
                return {
                    outcome: 'duplicate',
                    registrationCode: uploadIndex,
                    uploadIndex,
                    downloadId: (_c = status.idDescarcare) !== null && _c !== void 0 ? _c : null,
                    raw: { environment, upload, status },
                    refreshedRefreshToken
                };
            }
            return buildQueuedResult(environment, 'processing_failed', failureMessage, { upload, status }, refreshedRefreshToken);
        }
        const downloadId = (_d = status.idDescarcare) !== null && _d !== void 0 ? _d : null;
        if (downloadId) {
            await client.downloadDocument(downloadId);
        }
        return {
            outcome: 'registered',
            registrationCode: uploadIndex,
            uploadIndex,
            downloadId,
            raw: { environment, upload, status },
            refreshedRefreshToken
        };
    }
    catch (error) {
        const failureMessage = error instanceof Error ? error.message : 'ANAF submission failed.';
        const refreshedRefreshToken = tokenManager.getRefreshToken();
        if (looksLikeAuthError(failureMessage)) {
            return buildBlockedAuthResult(environment, 'auth_failed', failureMessage, {}, refreshedRefreshToken);
        }
        return buildQueuedResult(environment, 'submission_failed', failureMessage, {}, refreshedRefreshToken);
    }
}
//# sourceMappingURL=tsAnafClient.js.map