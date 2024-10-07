import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const key = randomBytes(8);
const iv = randomBytes(8);

const algorithm = "des-cbc";

export function encrypt(plaintext: string): string {
    const cipher = createCipheriv(algorithm, key, iv);
    const paddedPlaintext = Buffer.concat([Buffer.from(plaintext), Buffer.alloc(8 - (plaintext.length % 8), 8 - (plaintext.length % 8))]);
    const encrypted = Buffer.concat([cipher.update(paddedPlaintext), cipher.final()]);
    return encrypted.toString('base64');
}

export function decrypt(ciphertext: string): string {
    const decipher = createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64')), decipher.final()]);
    
    const paddingLength = decrypted[decrypted.length - 1];
    return decrypted.slice(0, -paddingLength).toString('utf8');
}