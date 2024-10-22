export interface UserFiles {
  id: string; // Unique identifier for the user file
  userId: string; // Identifier for the user who owns the file
  fileType: string; // Type of the file (e.g., document, pdf, etc.)
  fileName: string; // Name of the file

  aes_encrypted: Buffer; // AES encrypted file content
  aes_iv: Buffer; // Initialization vector for AES encryption

  rc4_encrypted: Buffer; // RC4 encrypted file content

  des_encrypted: Buffer; // DES encrypted file content
  des_iv: Buffer; // Initialization vector for DES encryption
}
