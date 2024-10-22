"use server";

import prisma from "@/lib/db";
import { arrayBufferToBuffer, encryptAES } from "@/components/encryptions/aes";
import { randomBytes } from "crypto";
import { encryptRC4 } from "@/components/encryptions/rc4";
import { encryptDES } from "@/components/encryptions/des";

export async function uploadFile(formData: FormData, token: string) {
  const secretKey = "testingkey"; // Use the non-public key

  if (!token) {
    throw new Error("Token is required for authentication");
  }
  console.log("secretkey:", secretKey);
  console.log("token:", token);
  try {
    const decodedToken = atob(token.split(".")[1]);
    const jsonObject = JSON.parse(decodedToken);
    const userId = jsonObject.id;
    console.log(userId);

    const file = formData.get("file_input") as File;
    const arrayBuffer = await file.arrayBuffer();
    const bufferFile = arrayBufferToBuffer(arrayBuffer);
    const iv = randomBytes(16);
    const ivDes = randomBytes(8);
    const userKeys = await getUserKeys(token);

    const userFile = await prisma.userFiles.create({
      data: {
        userId: userId,
        fileType: file.type,
        fileName: file.name,
        aes_encrypted: encryptAES(bufferFile, iv, userKeys!.key_AES) as Buffer,
        aes_iv: iv,
        // rc4_encrypted: encryptRC4(bufferFile) as Buffer,
        rc4_encrypted: encryptRC4(bufferFile, userKeys!.key_RC4) as Buffer,
        des_encrypted: encryptDES(
          bufferFile,
          ivDes,
          userKeys!.key_DES
        ) as Buffer,
        des_iv: ivDes,
      },
    });

    return userFile;
  } catch (error) {
    console.error("error saving file:", error);
  }
}

export async function getFiles(token: string) {
  const decodedToken = atob(token.split(".")[1]);
  const jsonObject = JSON.parse(decodedToken);
  const userId = jsonObject.id;

  const files = await prisma.userFiles.findMany({
    where: {
      userId: userId,
    },
  });

  return files;
}

export async function getUserKeys(token: string) {
  const decodedToken = atob(token.split(".")[1]);
  const jsonObject = JSON.parse(decodedToken);
  const userId = jsonObject.id;

  try {
    const userKeys = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        key_AES: true,
        key_DES: true,
        key_RC4: true,
      },
    });

    return userKeys; // This will return an object with key_AES, key_DES, and key_RC4
  } catch (error) {
    console.error("Error fetching user keys:", error);
    throw new Error("Unable to fetch user keys.");
  }
}

export async function deleteFiles(token: string, idFile: string) {
  try {
    const decodedToken = atob(token.split(".")[1]);
    const jsonObject = JSON.parse(decodedToken);
    const userId = jsonObject.id;

    const userFile = await prisma.userFiles.findUnique({
      where: { id: idFile },
    });

    if (!userFile) {
      throw new Error("file not found");
    }

    if (userFile.userId === userId) {
      const deletedFile = await prisma.userFiles.delete({
        where: { id: idFile },
      });

      return deletedFile;
    } else {
      throw new Error("you are not authorized to delete this file");
    }
  } catch (error) {
    console.error("error deleting file:", error);
  }
}
