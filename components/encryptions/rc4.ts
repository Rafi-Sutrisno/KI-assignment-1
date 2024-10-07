import { RC4 } from "crypto-js";
import CryptoJS from "crypto-js";

const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
if (!key) {
  throw new Error("Encryption key is missing from environment variables");
}

const bufferToWordArray = (
  buffer: Buffer | Uint8Array
): CryptoJS.lib.WordArray => {
  const wordArray = CryptoJS.lib.WordArray.create(buffer);

  return wordArray;
};

const wordArrayToBuffer = (wordArray: CryptoJS.lib.WordArray): Buffer => {
  const wordArrayBytes = wordArray.toString(CryptoJS.enc.Hex); // Hex or another encoding like Base64
  return Buffer.from(wordArrayBytes, "hex"); // Convert back to Buffer
};

export const encryptRC4 = (plaintext: string | Buffer): Buffer | string => {
  let encrypted;

  if (typeof plaintext === "string") {
    // Encrypting a string directly
    encrypted = RC4.encrypt(plaintext, key);
    return encrypted.toString();
  } else {
    // Encrypting a Buffer
    const wordArray = bufferToWordArray(plaintext);
    encrypted = RC4.encrypt(wordArray, key);
    return wordArrayToBuffer(encrypted.ciphertext);
  }
};

export const decryptRC4 = (ciphertext: string | Buffer): Buffer | string => {
  let decrypted;
  if (typeof ciphertext === "string") {
    // Decrypting a string directly
    decrypted = RC4.decrypt(ciphertext, key); // Decrypt using RC4
    return decrypted.toString();
  } else {
    // Decrypting a Buffer
    const encryptedWordArray = bufferToWordArray(ciphertext); // Convert Buffer to WordArray
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedWordArray,
    });

    decrypted = RC4.decrypt(cipherParams, key);
    return wordArrayToBuffer(decrypted);
  }
};
