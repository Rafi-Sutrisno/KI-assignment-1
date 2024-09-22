"use server";

import prisma from "@/lib/db";
import { arrayBufferToBuffer, encrypt } from "@/components/encryptions/aes";
import jwt from "jsonwebtoken";
import * as jwt_decode from "jwt-decode";

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

    const userFile = await prisma.userFiles.create({
      data: {
        userId: userId,
        fileType: file.type,
        aes_encrypted: Buffer.from("dummy_aes_encrypted_data"),
        rc4_encrypted: Buffer.from("dummy_aes_encrypted_data"),
        des_encrypted: Buffer.from("dummy_aes_encrypted_data"),
      },
    });

    return userFile;
  } catch (error) {
    console.error("error saving file:", error);
  }
}
