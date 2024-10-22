import { createCipheriv } from "crypto";

const algorithm = "des";

export function encryptDES(
  input: Buffer | string,
  iv: Buffer,
  key: Buffer
): Buffer | string {
  let cipher, encrypted;
  console.time("DES Encryption Time");
  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, iv); // No IV for RC4
    encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
  } else {
    cipher = createCipheriv(algorithm, key, iv); // No IV for RC4
    encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
  }
  console.timeEnd("DES Encryption Time");
  return encrypted;
}
