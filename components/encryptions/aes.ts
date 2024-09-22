import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const algorithm = "aes-256-cbc";

// generate random secure key
const key = randomBytes(32);

// generate vector initialization
const iv = randomBytes(16);

export function arrayBufferToBuffer(arrayBuffer: ArrayBuffer): Buffer {
  return Buffer.from(new Uint8Array(arrayBuffer));
}

export function encrypt(file: Buffer): Buffer {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(file);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted;
}

export function decrypt(encryptedFile: Buffer): Buffer {
  const decipher = createDecipheriv(algorithm, key, iv);

  // Decrypt the encrypted data
  let decrypted = decipher.update(encryptedFile);

  // Finalize decryption
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}
