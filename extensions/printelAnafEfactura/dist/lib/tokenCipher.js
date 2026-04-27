import crypto from 'node:crypto';
function getCipherKey() {
    const source = process.env.ANAF_TOKEN_ENCRYPTION_KEY;
    if (!source) {
        throw new Error('ANAF_TOKEN_ENCRYPTION_KEY must be configured before storing ANAF tokens.');
    }
    return crypto.createHash('sha256').update(source).digest();
}
export function encryptAnafToken(source) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getCipherKey(), iv);
    const encrypted = Buffer.concat([
        cipher.update(source, 'utf8'),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    return [
        iv,
        authTag,
        encrypted
    ].map((part)=>part.toString('base64url')).join('.');
}
export function decryptAnafToken(payload) {
    const [ivPart, authTagPart, encryptedPart] = String(payload).split('.');
    if (!ivPart || !authTagPart || !encryptedPart) {
        throw new Error('Invalid ANAF token payload');
    }
    const decipher = crypto.createDecipheriv('aes-256-gcm', getCipherKey(), Buffer.from(ivPart, 'base64url'));
    decipher.setAuthTag(Buffer.from(authTagPart, 'base64url'));
    return Buffer.concat([
        decipher.update(Buffer.from(encryptedPart, 'base64url')),
        decipher.final()
    ]).toString('utf8');
}
