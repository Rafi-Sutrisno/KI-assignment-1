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
  console.time("AES Encryption Time");
  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, iv);
    encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
  } else {
    cipher = createCipheriv(algorithm, key, iv);
    encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
  }
  console.timeEnd("AES Encryption Time");
  return encrypted;
}

export function decryptAES(
  encryptedInput: Buffer | string,
  iv: Buffer
): Buffer | string {
  let decipher, decrypted;
  console.time("AES Decryption Time");

  if (typeof encryptedInput === "string") {
    decipher = createDecipheriv(algorithm, key, iv);
    decrypted = decipher.update(encryptedInput, "hex", "utf8");
    decrypted += decipher.final("utf8");
  } else {
    decipher = createDecipheriv(algorithm, key, iv);

    // Decrypt the encrypted data
    decrypted = decipher.update(encryptedInput);

    // Finalize decryption
    decrypted = Buffer.concat([decrypted, decipher.final()]);
  }
  console.timeEnd("AES Decryption Time");
  return decrypted;
}
