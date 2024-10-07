import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "aes-256-cbc";

// get secret encryption key from env
const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const key = Buffer.from(encryptionKeyHex!, "hex");

export function arrayBufferToBuffer(arrayBuffer: ArrayBuffer): Buffer {
  return Buffer.from(new Uint8Array(arrayBuffer));
}

export function encryptAES(
  input: Buffer | string,
  iv: Buffer
): Buffer | string {
  let cipher, encrypted;
  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, iv);
    encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } else {
    cipher = createCipheriv(algorithm, key, iv);
    encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
  }
}

export function decryptAES(
  encryptedInput: Buffer,
  iv: Buffer
): Buffer | string {
  let decipher, decrypted;

  if (typeof encryptedInput === "string") {
    decipher = createDecipheriv(algorithm, key, iv);
    decrypted = decipher.update(encryptedInput, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } else {
    decipher = createDecipheriv(algorithm, key, iv);

    // Decrypt the encrypted data
    decrypted = decipher.update(encryptedInput);

    // Finalize decryption
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  }
}
