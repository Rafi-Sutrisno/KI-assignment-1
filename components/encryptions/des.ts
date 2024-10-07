import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "des-cbc";
const blockSize = 8; 
const key = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, "hex");

function pad(input: Buffer): Buffer {
  const paddingLength = blockSize - (input.length % blockSize);
  const padding = Buffer.alloc(paddingLength, paddingLength);
  return Buffer.concat([input, padding]);
}

function unpad(input: Buffer): Buffer {
  const paddingLength = input[input.length - 1];
  return input.slice(0, -paddingLength);
}

export function encryptDES(input: Buffer | string, iv: Buffer): Buffer | string {
  let cipher, encrypted;

  if (typeof input === "string") {
    cipher = createCipheriv(algorithm, key, iv);
    const paddedInput = pad(Buffer.from(input, "utf8"));
    encrypted = cipher.update(paddedInput);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  }
  else {
    cipher = createCipheriv(algorithm, key, iv);
    const paddedInput = pad(input);
    encrypted = cipher.update(paddedInput);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
  }
}

export function decryptDES(encryptedInput: Buffer | string, iv: Buffer): Buffer | string {
  let decipher, decrypted;
  
  if (typeof encryptedInput === "string") {
    decipher = createDecipheriv(algorithm, key, iv);
    const encryptedBuffer = Buffer.from(encryptedInput, "hex");
    decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const unpaddedData = unpad(decrypted);
    return unpaddedData.toString("utf8");
  }
  else {
    decipher = createDecipheriv(algorithm, key, iv);
    decrypted = decipher.update(encryptedInput);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const unpaddedData = unpad(decrypted);
    return unpaddedData;
  }
}