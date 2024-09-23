import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "aes-256-cbc";

// get secret encryption key from env
const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const key = Buffer.from(encryptionKeyHex!, "hex");

export function arrayBufferToBuffer(arrayBuffer: ArrayBuffer): Buffer {
  return Buffer.from(new Uint8Array(arrayBuffer));
}

export function encrypt(file: Buffer, iv: Buffer): Buffer {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(file);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted;
}

export function decrypt(encryptedFile: Buffer, iv: Buffer): Buffer {
  const decipher = createDecipheriv(algorithm, key, iv);

  // Decrypt the encrypted data
  let decrypted = decipher.update(encryptedFile);

  // Finalize decryption
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}
