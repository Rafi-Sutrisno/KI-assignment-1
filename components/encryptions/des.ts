import { createCipheriv } from "crypto";

const algorithm = "des";
const encryptionKeyHex =  process.env.NEXT_PUBLIC_ENCRYPTION_DES_KEY;
const key = Buffer.from(encryptionKeyHex!, "hex");

export function encryptDES(input: Buffer | string, iv: Buffer): Buffer | string {
  let cipher, encrypted;
  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, iv); // No IV for RC4
    encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } else {
    cipher = createCipheriv(algorithm, key, iv); // No IV for RC4
    encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
  }
}