"use strict";
// import crypto from 'crypto';
// import jwt from 'jsonwebtoken';
// import { ObjectId } from 'mongoose';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStreamToken = generateStreamToken;
exports.generateCompactKey = generateCompactKey;
exports.extractCompactKey = extractCompactKey;
// const SECRET_KEY = process.env.SECRET_KEY || 'oBX7lZ9zrZgXk4jT9aFJ3w6UhdP+5sl1lHhv3pzKa8Y=';
// export function generateStreamToken(length = 24): string {
//     return crypto.randomBytes(length).toString('base64');
// }
// function toBase64Url(base64: string): string {
//     if (!base64 || typeof base64 !== 'string') {
//         throw new Error('Invalid base64 input');
//     }
//     return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// }
// function fromBase64Url(base64Url: string): string {
//     if (!base64Url || typeof base64Url !== 'string') {
//         throw new Error('Invalid base64Url input');
//     }
//     // Add padding if necessary
//     const padding = '==='.slice(0, (4 - base64Url.length % 4) % 4);
//     return base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding;
// }
// export function generateCompositeKey(userId: ObjectId, streamToken: string, expirationTimestamp: number): string {
//     try {
//         const payload = {
//             userId,
//             streamToken,
//             exp: expirationTimestamp,
//         };
//         const jwtStreamKey = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
//         const encryptionKey = Buffer.from(SECRET_KEY, 'base64');
//         if (encryptionKey.length !== 32) {
//             throw new Error('Invalid encryption key length. Must be 32 bytes for AES-256-GCM.');
//         }
//         const iv = crypto.randomBytes(16);
//         const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
//         let encrypted = cipher.update(jwtStreamKey, 'utf8', 'base64');
//         encrypted += cipher.final('base64');
//         const authTag = cipher.getAuthTag().toString('base64');
//         const base64UrlEncrypted = toBase64Url(encrypted);
//         const base64UrlAuthTag = toBase64Url(authTag);
//         const base64UrlIV = toBase64Url(iv.toString('base64'));
//         return `${base64UrlIV}.${base64UrlEncrypted}.${base64UrlAuthTag}`;
//     } catch (error) {
//         console.error('Error generating composite key:', error);
//         throw new Error('Failed to generate stream key');
//     }
// }
// export function decryptCompositeKey(encryptedStreamKey: string): any {
//     try {
//         if (!encryptedStreamKey || typeof encryptedStreamKey !== 'string') {
//             throw new Error('Invalid stream key format');
//         }
//         const parts = encryptedStreamKey.split('.');
//         if (parts.length !== 3) {
//             throw new Error('Invalid stream key structure');
//         }
//         const [base64UrlIV, base64UrlEncryptedData, base64UrlAuthTag] = parts;
//         // Validate each part
//         if (!base64UrlIV || !base64UrlEncryptedData || !base64UrlAuthTag) {
//             throw new Error('Missing required stream key components');
//         }
//         const iv = Buffer.from(fromBase64Url(base64UrlIV), 'base64');
//         const encryptedData = Buffer.from(fromBase64Url(base64UrlEncryptedData), 'base64');
//         const authTag = Buffer.from(fromBase64Url(base64UrlAuthTag), 'base64');
//         const encryptionKey = Buffer.from(SECRET_KEY, 'base64');
//         const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
//         decipher.setAuthTag(authTag);
//         let decrypted = decipher.update(encryptedData);
//         decrypted = Buffer.concat([decrypted, decipher.final()]);
//         const decodedString = decrypted.toString('utf8');
//         const decoded = jwt.verify(decodedString, SECRET_KEY, { algorithms: ['HS256'] });
//         return decoded;
//     } catch (error) {
//         console.error('Error decrypting stream key:', error);
//         throw new Error('Invalid or expired stream key');
//     }
// }
// import crypto from 'crypto';
// import jwt from 'jsonwebtoken';
// import { ObjectId } from 'mongoose';
// const SECRET_KEY = process.env.SECRET_KEY || 'oBX7lZ9zrZgXk4jT9aFJ3w6UhdP+5sl1lHhv3pzKa8Y=';
// const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
// const MAX_STREAM_KEY_LENGTH = 255; // NGINX RTMP limitation
// export function generateStreamToken(length = 16): string {
//     return crypto.randomBytes(length).toString('base64');
// }
// function toBase64Url(str: string): string {
//     return str.replace(/\+/g, '-')
//               .replace(/\//g, '_')
//               .replace(/=+$/, '');
// }
// function fromBase64Url(str: string): string {
//     str = str.replace(/-/g, '+').replace(/_/g, '/');
//     while (str.length % 4) {
//         str += '=';
//     }
//     return str;
// }
// export function generateCompositeKey(userId: ObjectId, streamToken: string, expirationTimestamp: number): string {
//     try {
//         // Create a shorter payload
//         const payload = {
//             u: userId.toString(), // shortened key
//             s: streamToken,      // shortened key
//             e: expirationTimestamp // shortened key
//         };
//         // Sign JWT with a more compact algorithm
//         const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
//         // Use a smaller IV size (12 bytes is secure for GCM)
//         const iv = crypto.randomBytes(12);
//         const encryptionKey = crypto.scryptSync(SECRET_KEY, 'salt', 32);
//         const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
//         let encrypted = cipher.update(token, 'utf8', 'base64');
//         encrypted += cipher.final('base64');
//         const authTag = cipher.getAuthTag();
//         // Combine components
//         const components = [
//             iv.toString('base64'),
//             encrypted,
//             authTag.toString('base64')
//         ].map(toBase64Url);
//         const streamKey = components.join('.');
//         // Verify length
//         if (streamKey.length > MAX_STREAM_KEY_LENGTH) {
//             throw new Error(`Stream key length ${streamKey.length} exceeds maximum allowed length of ${MAX_STREAM_KEY_LENGTH}`);
//         }
//         return streamKey;
//     } catch (error) {
//         console.error('Error generating stream key:', error);
//         throw new Error('Failed to generate stream key');
//     }
// }
// export function decryptCompositeKey(encryptedStreamKey: string): any {
//     try {
//         // Split the components
//         const parts = encryptedStreamKey.split('.');
//         if (parts.length !== 3) {
//             throw new Error('Invalid stream key format');
//         }
//         // Decode components
//         const [ivStr, encryptedData, authTagStr] = parts.map(fromBase64Url);
//         // Convert components to buffers
//         const iv = Buffer.from(ivStr, 'base64');
//         const encrypted = Buffer.from(encryptedData, 'base64');
//         const authTag = Buffer.from(authTagStr, 'base64');
//         // Decrypt
//         const encryptionKey = crypto.scryptSync(SECRET_KEY, 'salt', 32);
//         const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
//         decipher.setAuthTag(authTag);
//         let decrypted = decipher.update(encrypted, undefined, 'utf8'); // Omit the encoding for the first argument
//         decrypted += decipher.final('utf8'); // Use 'utf8' as the output encoding
//         // Verify and decode JWT
//         const decoded = jwt.verify(decrypted, SECRET_KEY) as any;
//         // Map back to original property names
//         return {
//             userId: decoded.u,
//             streamToken: decoded.s,
//             exp: decoded.e
//         };
//     } catch (error) {
//         console.error('Error decrypting stream key:', error);
//         throw new Error('Invalid or expired stream key');
//     }
// }
// import crypto from 'crypto';
// import { Types } from 'mongoose';
// import CustomError from '../shared/CustomError';
// const SECRET_KEY = process.env.SECRET_KEY || 'oBX7lZ9zrZgXk4jT9aFJ3w6UhdP+5sl1lHhv3pzKa8Y=';
// const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
// function toBase64Url(buffer: Buffer): string {
//     return buffer.toString('base64')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_')
//         .replace(/=+$/, '');
// }
// function fromBase64Url(str: string): Buffer {
//     str = str.replace(/-/g, '+').replace(/_/g, '/');
//     while (str.length % 4) str += '=';
//     return Buffer.from(str, 'base64');
// }
// export function generateStreamToken(length = 8): string {
//     return crypto.randomBytes(length)
//         .toString('base64')
//         .replace(/[+\/=]/g, '')
//         .slice(0, length);
// }
// export function generateCompositeKey(userId: Types.ObjectId | string, streamToken: string, expirationTimestamp: number): string {
//     try {
//         // Log input values
//         console.log('Generating key for:', {
//             userId: userId.toString(),
//             streamToken,
//             expirationTimestamp
//         });
//         const userIdObj = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
//         // Create payload
//         const payload = {
//             u: userIdObj.toHexString(), // Store full 24-char hex
//             s: streamToken,
//             e: expirationTimestamp
//         };
//         console.log('Generated payload:', payload);
//         const payloadString = JSON.stringify(payload);
//         const iv = crypto.randomBytes(12);
//         const encryptionKey = crypto.createHash('sha256').update(SECRET_KEY).digest();
//         const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
//         const encrypted = Buffer.concat([
//             cipher.update(payloadString, 'utf8'),
//             cipher.final()
//         ]);
//         const authTag = cipher.getAuthTag();
//         const streamKey = [
//             toBase64Url(iv),
//             toBase64Url(encrypted),
//             toBase64Url(authTag)
//         ].join('.');
//         console.log('Final stream key:', streamKey);
//         return streamKey;
//     } catch (error) {
//         console.error('Error generating stream key:', error);
//         throw new CustomError('Failed to generate stream key', 500);
//     }
// }
// export function decryptCompositeKey(encryptedStreamKey: string): {
//     userId: Types.ObjectId;
//     streamToken: string;
//     expirationTimestamp: number;
// } {
//     try {
//         console.log('Attempting to decrypt key:', encryptedStreamKey);
//         const [ivStr, encryptedData, authTagStr] = encryptedStreamKey.split('.');
//         if (!ivStr || !encryptedData || !authTagStr) {
//             throw new CustomError('Invalid stream key format', 400);
//         }
//         const iv = fromBase64Url(ivStr);
//         const encrypted = fromBase64Url(encryptedData);
//         const authTag = fromBase64Url(authTagStr);
//         const encryptionKey = crypto.createHash('sha256').update(SECRET_KEY).digest();
//         const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
//         decipher.setAuthTag(authTag);
//         const decrypted = Buffer.concat([
//             decipher.update(encrypted),
//             decipher.final()
//         ]).toString('utf8');
//         console.log('Decrypted raw data:', decrypted);
//         const payload = JSON.parse(decrypted);
//         console.log('Parsed payload:', payload);
//         // Validate payload structure
//         if (!payload.u || !payload.s || !payload.e) {
//             console.error('Missing required payload fields:', payload);
//             throw new CustomError('Invalid payload structure', 400);
//         }
//         // Log the userId before validation
//         console.log('Extracted userId:', payload.u);
//         // Validate userId format with more detailed error
//         if (!/^[0-9a-fA-F]{24}$/.test(payload.u)) {
//             console.error('Invalid userId format. Expected 24-char hex, got:', payload.u);
//             throw new CustomError(`Invalid userId format (${payload.u.length} chars): ${payload.u}`, 400);
//         }
//         return {
//             userId: new Types.ObjectId(payload.u),
//             streamToken: payload.s,
//             expirationTimestamp: payload.e
//         };
//     } catch (error) {
//         if (error instanceof CustomError) {
//             throw error;
//         } else {
//             console.error(error);
//             throw new CustomError("Internal Server Error", 500);
//         }
//     }
// }
// // Add a helper function to verify a stream key
// export function verifyStreamKey(streamKey: string): boolean {
//     try {
//         const result = decryptCompositeKey(streamKey);
//         console.log('Verification result:', result);
//         return true;
//     } catch (error) {
//         console.error('Verification failed:', error);
//         return false;
//     }
// }
const crypto_1 = __importDefault(require("crypto"));
// Constants for encryption
const IV_LENGTH = 12;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const AUTH_TAG_LENGTH = 16;
// Ensure encryption key is always 32 bytes (256 bits)
function getEncryptionKey() {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (SECRET_KEY) {
        // If SECRET_KEY is provided, hash it to ensure 32 bytes length
        return crypto_1.default.createHash('sha256').update(SECRET_KEY).digest();
    }
    // If no SECRET_KEY, generate a random 32 bytes key
    return crypto_1.default.randomBytes(32);
}
// Convert ObjectId to a shorter string representation
function shortenObjectId(objectId) {
    return objectId.toString();
}
// Convert timestamp to base36 to make it shorter
function encodeTimestamp(timestamp) {
    return timestamp.toString(36);
}
function decodeTimestamp(encoded) {
    return parseInt(encoded, 36);
}
// Custom base64 encoding that uses a more compact character set
function toCompactBase64(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
function fromCompactBase64(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) {
        str += '='.repeat(4 - pad);
    }
    return Buffer.from(str, 'base64');
}
function generateStreamToken(length = 16) {
    return crypto_1.default.randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
function generateCompactKey(userId, streamToken, expirationTimestamp) {
    try {
        // Get proper 32-byte encryption key
        const encryptionKey = getEncryptionKey();
        // Compress the input data
        const shortUserId = shortenObjectId(userId);
        const shortToken = streamToken.slice(0, 16); // Take first 16 chars of stream token
        const shortTimestamp = encodeTimestamp(expirationTimestamp);
        // Combine the shortened data
        const payload = `${shortUserId}:${shortToken}:${shortTimestamp}`;
        // Generate a shorter IV
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        // Encrypt the payload
        let encrypted = cipher.update(payload, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        // Get authentication tag
        const authTag = cipher.getAuthTag();
        // Combine all components and encode
        const combined = Buffer.concat([iv, encrypted, authTag]);
        // Convert to compact base64
        return toCompactBase64(combined);
    }
    catch (error) {
        console.error('Error generating compact key:', error);
        throw new Error('Failed to generate stream key');
    }
}
function extractCompactKey(compactKey) {
    try {
        // Get proper 32-byte encryption key
        const encryptionKey = getEncryptionKey();
        // Decode the compact key
        const combined = fromCompactBase64(compactKey);
        // Extract components
        const iv = combined.slice(0, IV_LENGTH);
        const authTag = combined.slice(-AUTH_TAG_LENGTH);
        const encrypted = combined.slice(IV_LENGTH, -AUTH_TAG_LENGTH);
        // Decrypt
        const decipher = crypto_1.default.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        // Split and parse the components
        const [userId, streamToken, timestamp] = decrypted.toString().split(':');
        console.log("====extractCompactKey====", {
            userId: userId,
            streamToken: streamToken,
            timestamp: timestamp
        });
        return {
            userId,
            streamToken,
            expirationTimestamp: decodeTimestamp(timestamp)
        };
    }
    catch (error) {
        console.error('Error extracting compact key:', error);
        throw new Error('Invalid or expired stream key');
    }
}
