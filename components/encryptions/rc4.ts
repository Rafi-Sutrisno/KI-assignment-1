import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "rc4";
const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_RC4_KEY;
const key = Buffer.from(encryptionKeyHex!, "hex");

export function encryptRC4(input: Buffer | string): Buffer | string {
  let cipher, encrypted;
  console.time("RC4 Encryption Time");
  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, null); // No IV for RC4
    encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
  } else {
    cipher = createCipheriv(algorithm, key, null); // No IV for RC4
    encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
  }
  console.timeEnd("RC4 Encryption Time");
  return encrypted;
}
