import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "aes-256-cbc";
const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const key = Buffer.from(encryptionKeyHex!, "hex");

export function encryptRC4(input: Buffer | string): Buffer | string {
  let cipher, encrypted;
  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, null); // No IV for RC4
    encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } else {
    cipher = createCipheriv(algorithm, key, null); // No IV for RC4
    encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
  }
}

// Decrypt using RC4, similar to AES
export function decryptRC4(encryptedInput: Buffer | string): Buffer | string {
  let decipher, decrypted;
  if (typeof encryptedInput === "string") {
    decipher = createDecipheriv(algorithm, key, null); // No IV for RC4
    decrypted = decipher.update(encryptedInput, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } else {
    decipher = createDecipheriv(algorithm, key, null); // No IV for RC4
    decrypted = decipher.update(encryptedInput);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
  }
}
