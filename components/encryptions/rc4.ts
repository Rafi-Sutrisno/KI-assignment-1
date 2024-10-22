import { createCipheriv } from "crypto";

const algorithm = "rc4";

export function encryptRC4(
  input: Buffer | string,
  key: Buffer
): Buffer | string {
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
