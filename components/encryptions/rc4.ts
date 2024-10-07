import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// RC4 does not use an initialization vector (IV), but you still need a key.
const algorithm = "rc4";

// Function to encrypt a file (Buffer) using RC4
export function rc4Encrypt(file: Buffer, key: Buffer): Buffer {
  const cipher = createCipheriv(algorithm, key, null);
  const encrypted = Buffer.concat([cipher.update(file), cipher.final()]);
  return encrypted;
}

// Function to decrypt a file (Buffer) using RC4
export function rc4Decrypt(encryptedFile: Buffer, key: Buffer): Buffer {
  const decipher = createDecipheriv(algorithm, key, null);
  const decrypted = Buffer.concat([
    decipher.update(encryptedFile),
    decipher.final(),
  ]);
  return decrypted;
}
