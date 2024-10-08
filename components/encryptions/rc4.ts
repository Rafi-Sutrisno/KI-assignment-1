import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "rc4";
const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_DES_KEY;;
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
  const encryptionKeyHex = "3f27cb95e2d8d29600ca4e860a1f3ca3";
  const key = Buffer.from(encryptionKeyHex, "hex");
  console.log("ini key: ", key);
  if (typeof encryptedInput === "string") {
    decipher = createDecipheriv("rc4", key, ""); // No IV for RC4
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
