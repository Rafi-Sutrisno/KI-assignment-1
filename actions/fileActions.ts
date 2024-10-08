"use server";

import prisma from "@/lib/db";
import { arrayBufferToBuffer, encryptAES } from "@/components/encryptions/aes";
import { randomBytes } from "crypto";
import { encryptRC4 } from "@/components/encryptions/rc4";

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

    const userFile = await prisma.userFiles.create({
      data: {
        userId: userId,
        fileType: file.type,
        fileName: file.name,
        aes_encrypted: encryptAES(bufferFile, iv) as Buffer,
        aes_iv: iv,
        // rc4_encrypted: encryptRC4(bufferFile) as Buffer,
        rc4_encrypted: Buffer.from("dummy_aes_encrypted_data"),
        des_encrypted: Buffer.from("dummy_aes_encrypted_data"),
        des_iv: iv,
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
