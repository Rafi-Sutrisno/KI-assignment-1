"use server";

import prisma from "@/lib/db";
import { UserLoginParams } from "@/interface/user";
import jwt from "jsonwebtoken";
import {
  arrayBufferToBuffer,
  decryptAES,
  encryptAES,
} from "@/components/encryptions/aes";
import { createPrivateKey, privateDecrypt, randomBytes } from "crypto";
import { encryptRC4 } from "@/components/encryptions/rc4";
import { encryptDES } from "@/components/encryptions/des";
import { generateKeyPairSync } from "crypto";
import { UserAccess } from "@/interface/user_access";

export async function createUser(formData: FormData) {
  // IV and Key generating
  const iv = randomBytes(16);
  const ivDes = randomBytes(8);
  const keyAES = randomBytes(32);
  const keyRC4 = randomBytes(16);
  const keyDES = randomBytes(8);

  // Generating public and private key
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: process.env.NEXT_PUBLIC_PASSPHRASE,
    },
  });
  const publicKeyBytes = Buffer.from(publicKey, "utf-8");
  const privateKeyBytes = Buffer.from(privateKey, "utf-8");

  // Format the income string
  const income = ((formData.get("income-1") as string) +
    " - " +
    formData.get("income-2")) as string;

  const userData = {
    username: formData.get("name") as string,
    email: formData.get("email") as string,

    password_AES: encryptAES(
      formData.get("password") as string,
      iv,
      keyAES
    ) as string,

    health_data_RC4: encryptRC4(
      formData.get("health_data") as string,
      keyRC4
    ) as string,

    income_DES: encryptDES(income, ivDes, keyDES) as string,

    des_iv: ivDes,
    aes_iv: iv,

    key_AES: keyAES,
    key_RC4: keyRC4,
    key_DES: keyDES,

    publicKey: publicKeyBytes,
    privateKey: privateKeyBytes,
  };

  const file = formData.get("file_input") as File;
  const arrayBuffer = await file.arrayBuffer();
  const bufferFile = arrayBufferToBuffer(arrayBuffer);

  const user = await prisma.user.create({ data: userData });

  const userFile = await prisma.userFiles.create({
    data: {
      userId: user.id,
      fileType: file.type,
      fileName: file.name,
      aes_encrypted: encryptAES(bufferFile, iv, keyAES) as Buffer,
      rc4_encrypted: encryptRC4(bufferFile, keyRC4) as Buffer,
      des_encrypted: encryptDES(bufferFile, ivDes, keyDES) as Buffer,

      aes_iv: iv,
      des_iv: ivDes,
    },
  });

  return { user, userFile };
}

export async function userLogin(params: UserLoginParams) {
  const { username, password } = params;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  console.log("ini aes_iv login: ", user.aes_iv);
  const passwordDecrypt = decryptAES(
    user.password_AES as string,
    user.aes_iv,
    user.key_AES
  );
  console.log(passwordDecrypt);

  if (passwordDecrypt !== password) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.NEXT_PUBLIC_JWT_KEY as string,
    { expiresIn: "1h" }
  );

  return { token };
}

export async function getCurrentUser(token: string) {
  console.log("ini token: ", token);
  const decodedToken = atob(token.split(".")[1]);
  const jsonObject = JSON.parse(decodedToken);
  const userId = jsonObject.id;
  console.log(userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

async function getPrivateKey(token: string) {
  const decodedToken = atob(token.split(".")[1]);
  const jsonObject = JSON.parse(decodedToken);
  const userId = jsonObject.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      privateKey: true,
    },
  });

  return user;
}

export async function handleDecryptAES(
  encryptedInput: string | undefined,
  aes_iv: Buffer,
  key: Buffer
) {
  const decrypted = decryptAES(
    encryptedInput as string,
    Buffer.from(aes_iv),
    key
  ) as string;
  return decrypted;
}

export async function getAllUser(token: string) {
  const decodedToken = atob(token.split(".")[1]);
  const jsonObject = JSON.parse(decodedToken);
  const userId = jsonObject.id;
  console.log(userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            user_files: true,
          },
        },
        user_files: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            userId: true,
          },
        },
      },
    });

    return users;
  }
  return [];
}

export async function getUserAccess(user_request_id: string) {
  const userAccess = await prisma.userAccess.findMany({
    where: {
      user_request_id: user_request_id,
    },
    select: {
      file_id: true,
    },
  });

  return userAccess;
}

export async function isSharedKeyCorrect(
  sharedKey: string,
  savedKey: { type: string; data: number[] }
) {
  const bufferSavedKey = Buffer.from(savedKey.data);
  const castSavedKey = bufferSavedKey.toString("base64");

  if (sharedKey === castSavedKey) return true;
  else return false;
}

export async function downloadShared(
  token: string,
  sharedKey: string,
  selected: UserAccess
) {
  const userPrivate = await getPrivateKey(token);
  const method = selected.method;

  const privateKey = createPrivateKey({
    key: userPrivate?.privateKey as Buffer, // Ensure this is in PEM format
    format: "pem",
    type: "pkcs8", // Matches the key type when stored
    passphrase: `${process.env.NEXT_PUBLIC_PASSPHRASE}`, // Use the correct passphrase used during key generation
  });

  const bufferShared = Buffer.from(sharedKey, "base64");

  const decryptionKey = privateDecrypt(privateKey, bufferShared);

  let downloaded, encryptedBuffer;

  if (method === "AES") {
    encryptedBuffer = selected.file.aes_encrypted;
    const key_AES = decryptionKey;
    const ivAes = selected.file.aes_iv;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/decryptAES/file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedBuffer, ivAes, key_AES }),
      }
    );

    downloaded = await response.json();
  } else if (method === "RC4") {
    encryptedBuffer = selected.file.rc4_encrypted;
    const key_RC4 = decryptionKey;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/decrypt/file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedBuffer, key_RC4 }),
      }
    );

    downloaded = await response.json();
  } else {
    encryptedBuffer = selected.file.des_encrypted;
    const key_DES = decryptionKey;
    const ivDes = selected.file.des_iv;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/decryptDES/file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedBuffer, ivDes, key_DES }),
      }
    );

    downloaded = await response.json();
  }

  return downloaded;
}

export async function getUserAccessManager(user_owner_id: string) {
  const userAccess = await prisma.userAccess.findMany({
    where: {
      user_owner_id: user_owner_id,
      status: 1,
    },
    select: {
      id: true,
      user_request_id: true,
      file_id: true,
    },
  });

  const userAccessWithDetails = await Promise.all(
    userAccess.map(async (access) => {
      const username = await prisma.user.findUnique({
        where: {
          id: access.user_request_id,
        },
        select: {
          username: true,
        },
      });

      const filename = await prisma.userFiles.findUnique({
        where: {
          id: access.file_id,
        },
        select: {
          fileName: true,
        },
      });

      return {
        ...access,
        username: username?.username ?? null,
        fileName: filename?.fileName ?? null,
      };
    })
  );

  return userAccessWithDetails;
}

export async function removeUserAccess(id: string) {
  try {
    await prisma.userAccess.delete({
      where: {
        id: id,
      },
    });
    return { ok: true }; // Mengembalikan respons berhasil
  } catch (error) {
    console.error("Error deleting user access:", error);
    return { ok: false, message: "Failed to remove user access" }; // Mengembalikan respons gagal dengan pesan error
  }
}
