import crypto from 'crypto';
import { ObjectId } from 'mongoose';

const IV_LENGTH = 12;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (SECRET_KEY) {
        return crypto.createHash('sha256').update(SECRET_KEY).digest();
    }
    return crypto.randomBytes(32);
}

function shortenObjectId(objectId: ObjectId): string {
    return objectId.toString();
}

function encodeTimestamp(timestamp: number): string {
    return timestamp.toString(36);
}

function decodeTimestamp(encoded: string): number {
    return parseInt(encoded, 36);
}

function toCompactBase64(buffer: Buffer): string {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function fromCompactBase64(str: string): Buffer {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) {
        str += '='.repeat(4 - pad);
    }
    return Buffer.from(str, 'base64');
}

export function generateStreamToken(length = 16): string {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function generateCompactKey(userId: ObjectId, streamToken: string, expirationTimestamp: number): string {
    try {
        const encryptionKey = getEncryptionKey();
        
        const shortUserId = shortenObjectId(userId);
        const shortToken = streamToken.slice(0, 16); 
        const shortTimestamp = encodeTimestamp(expirationTimestamp);
        
        const payload = `${shortUserId}:${shortToken}:${shortTimestamp}`;
        
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        
        let encrypted = cipher.update(payload, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        const authTag = cipher.getAuthTag();
        
        const combined = Buffer.concat([iv, encrypted, authTag]);
        
        return toCompactBase64(combined);
    } catch (error) {
        console.error('Error generating compact key:', error);
        throw new Error('Failed to generate stream key');
    }
}

export function extractCompactKey(compactKey: string): {
    userId: string;
    streamToken: string;
    expirationTimestamp: number;
} {
    try {
        const encryptionKey = getEncryptionKey();
        
        const combined = fromCompactBase64(compactKey);
        
        const iv = combined.slice(0, IV_LENGTH);
        const authTag = combined.slice(-AUTH_TAG_LENGTH);
        const encrypted = combined.slice(IV_LENGTH, -AUTH_TAG_LENGTH);
        
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        const [userId, streamToken, timestamp] = decrypted.toString().split(':');
        console.log("====extractCompactKey====",{
            userId: userId,
            streamToken:streamToken, 
            timestamp: timestamp
        })
        return {
            userId,
            streamToken,
            expirationTimestamp: decodeTimestamp(timestamp)
        };
    } catch (error) {
        console.error('Error extracting compact key:', error);
        throw new Error('Invalid or expired stream key');
    }
}