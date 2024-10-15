[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/O8GorTml)

**Symmetric Data Encryption Application Report**

## Author

#### Smooth Brains Team

| Name                           | NRP        | Github                                            |
| ------------------------------ | ---------- | ------------------------------------------------- |
| Ahda Filza Ghaffaru            | 5025211144 | [Ahdaaa](https://github.com/Ahdaaa)               |
| Muhammad Rafi Sutrisno         | 5025211167 | [Rafi-Sutrisno](https://github.com/Rafi-Sutrisno) |
| Muhammad Rafi Insan Fillah     | 5025211169 | [Mengz04](https://github.com/Mengz04)             |
| Abhinaya Radiansyah Listiyanto | 5025211173 | [Abhinaya173](https://github.com/Abhinaya173)     |

#### Types of data that we store

- **String**: Used for storing textual data, such as usernames and other string-based information.
- **Buffer**: Utilized for byte-oriented encryption, making it ideal for encrypting binary files like PDFs, DOCs, XLSs, and MP4s.

### Algorithms

#### AES

We are using AES (Advanced Encryption Standard) encryption with Node.js's built-in crypto module. The chosen encryption method is AES-256-CBC (Cipher Block Chaining), which is a symmetric encryption algorithm that encrypts data in fixed-size blocks. AES-256-CBC uses a 256-bit encryption key, ensuring high levels of security for sensitive data.

**Algorithm**: `AES-256-CBC`

- AES-256: This encryption standard uses a 256-bit key, making it one of the most secure encryption methods available. It is highly suitable for protecting sensitive data, ensuring strong security for data storage and transmission.
- CBC Mode: Cipher Block Chaining (CBC) mode ensures that each block of plaintext is XORed with the previous block of ciphertext before encryption. This process enhances security by preventing patterns in the plaintext from being visible in the ciphertext. Even if identical blocks of plaintext appear in the data, they will produce different blocks of ciphertext due to the chaining mechanism.

**Advantages**

1. High Security: The 256-bit key provides strong resistance to brute-force attacks. The CBC mode further strengthens security by ensuring that identical blocks of plaintext produce different ciphertext blocks.
2. Suitability for Sensitive Data: AES-256-CBC is commonly used for encrypting highly sensitive data, including personal information, financial data, and confidential files.
3. Versatility: This implementation supports encrypting both string data (for usernames and other text) and binary data (for files like PDFs and MP4s).

**Explanation of the Code**

1. Algorithm Definition:

   - The algorithm used is defined as aes-256-cbc, specifying AES with a 256-bit key in CBC mode.
   - The key is retrieved from the environment variable (NEXT_PUBLIC_ENCRYPTION_KEY) and is converted to a Buffer for encryption.

2. Data Encryption:

   - The encryptAES function handles both strings and Buffers (binary data). For strings, the data is encoded in UTF-8 and converted to hexadecimal format during encryption. For binary data (stored in Buffer format), the data is processed directly.

3. Initialization Vector (IV):

   - IV is passed to ensure that even when the same data is encrypted multiple times with the same key, it produces different ciphertext each time. This prevents attackers from detecting patterns, adding a layer of security.

4. Buffer Management:
   - The arrayBufferToBuffer function is used to convert ArrayBuffer (often used in browser environments) into Buffer objects, which are required by Node.js for encryption of binary files.

#### RC4

In this implementation, we are using RC4 (Rivest Cipher 4) for encryption. RC4 is a stream cipher that operates on a continuous stream of data rather than encrypting data in fixed-size blocks. It uses the Node.js crypto module for encryption, ensuring compatibility and efficiency in modern applications.

**Algorithm**: `RC4`

- RC4: RC4 is a stream cipher known for its simplicity and speed. It encrypts data one byte at a time, making it efficient for real-time applications and well-suited for encrypting both textual and binary data. It requires only a secret key for encryption, and there is no need for an initialization vector (IV), as each byte of the data is encrypted individually.

**Advantages**

1. Efficiency: RC4 is fast and efficient for encrypting large datasets, especially when performance is a priority.
2. Simplicity: RC4’s stream-based nature makes it straightforward to implement and requires minimal overhead compared to block ciphers.
3. No IV Requirement: Unlike block ciphers (like AES), RC4 does not require an IV, which simplifies encryption and decryption processes. This can be beneficial for scenarios where adding an IV would increase complexity or overhead.

**Explanation of the Code**

1. Algorithm Definition:

   - The algorithm used is rc4, which specifies the use of the RC4 stream cipher.

2. Data Encryption:

   - The encryptRC4 function handles both strings and Buffers (binary data). For strings, the data is encrypted using the RC4 stream cipher and returned as a hexadecimal string. For binary data, the data is processed directly and returned as a Buffer.

3. Buffer Management:
   - The Buffer class is used for byte-oriented data like binary files (PDFs, DOCs, XLSs, MP4s). This ensures that both text-based and binary data can be securely encrypted using the RC4 cipher.

#### DES

In this implementation, we are using DES (Data Encryption Standard) for encryption. DES is a block cipher that encrypts data in fixed-size blocks, typically 64 bits. It uses a symmetric key for encryption and decryption, meaning the same key is required for both operations. In this implementation, we use the Node.js crypto module to ensure compatibility and efficiency in modern applications.

**Algorithm**: `DES-CBC`

- DES is a block cipher that divides data into fixed-size blocks (usually 64 bits) and encrypts them individually. It operates in multiple modes (ECB, CBC, etc.), but in this implementation, we will use CBC mode, which requires an 8 bytes Initialization Vector (IV) for encryption. The block nature of DES makes it slower than stream ciphers like RC4 but provides additional security due to the block structure and the use of an IV.

**Advantages**

1. Security: DES provides a secure method for encrypting blocks of data and is still widely used in legacy systems.
2. Widely Supported: DES is supported in most cryptographic libraries, making it easy to implement across various platforms.
3. Block Cipher: Unlike stream ciphers (like RC4), DES operates on blocks of data, providing added protection against certain types of attacks.

**Explanation of the Code**

1. Algorithm Definition:

   - The algorithm used is des, which specifies the use of DES for block encryption.

2. Data Encryption:

   - The encryptDES function handles both strings and Buffers (binary data). For strings, the data is encrypted using DES and returned as a hexadecimal string. For binary data, the data is processed directly and returned as a Buffer.

3. IV Requirement:
   - Unlike RC4, DES requires an 8 bytes IV for encryption, which adds complexity but also enhances security by preventing repeated patterns in ciphertext when the same key is used for multiple encryption sessions.

### Performance Analysis

#### Document Files

- Encryption Time

  - AES: 1.716 ms
  - RC4: 2.268 ms
  - DES: 11.814 ms

- Decryption Time

  - AES: 43.304 ms
  - RC4: 52.042 ms
  - DES: 69.027 ms

![alt text](/images/image.png)

#### Pdf Files

- Encryption Time

  - AES: 4.972 ms
  - RC4: 5.209 ms
  - DES: 33.276 ms

- Decryption Time

  - AES: 125.521 ms
  - RC4: 146.035 ms
  - DES: 165.056 ms

![alt text](/images/image-2.png)

#### Xls Files

- Encryption Time

  - AES: 2.545 ms
  - RC4: 2.668 ms
  - DES: 19.489 ms

- Decryption Time

  - AES: 85.442 ms
  - RC4: 89.044 ms
  - DES: 102.971 ms

![alt text](/images/image-3.png)

#### Video Files

- Encryption Time

  - AES: 4.86 ms
  - RC4: 5.476 ms
  - DES: 36.826 ms

- Decryption Time

  - AES: 143.084 ms
  - RC4: 163.042 ms
  - DES: 197.49 ms

![alt text](/images/image-4.png)

### Summary

#### AES

- AES consistently outperforms both RC4 and DES in nearly every scenario for encryption and decryption, regardless of file types. This superior performance can be attributed to AES's design, which is tailored for contemporary computing environments. With optimizations in both hardware (such as AES-NI instructions) and software, AES demonstrates significantly greater efficiency compared to older algorithms like DES.

- As a block cipher, AES is adept at operating on modern multi-core processors, allowing it to efficiently process both small and large files, including documents, PDFs, Excel spreadsheets, and videos. This capability underscores AES's versatility and effectiveness in a wide range of applications.

#### RC4

- RC4, being a stream cipher, performs well for encryption but slightly worse for decryption, especially with larger file types like videos and PDFs. Stream ciphers encrypt data byte-by-byte, which can make them less efficient when handling large files. However, RC4 has lightweight encryption and is still competitive with AES for smaller files (documents, XLS).

- The difference in decryption time compared to AES is likely due to the need to process each bit or byte serially, which can become a bottleneck as file size grows.

#### DES

- DES is consistently the slowest of the three algorithms, both for encryption and decryption. This is because:

  - DES is an outdated algorithm with a 56-bit key, making it much less secure than AES or even RC4.
  - It also lacks optimizations for modern processors, making it inefficient for large files.
  - DES’s block size and inefficient processing scheme make it particularly slow for larger files (e.g., videos and PDFs).

- Decryption with DES is particularly slow, as its algorithm involves multiple rounds of encryption operations that aren't optimized for decryption on modern hardware.
