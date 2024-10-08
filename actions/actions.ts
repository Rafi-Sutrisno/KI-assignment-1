"use server";

import prisma from "@/lib/db";
import { UserLoginParams } from "@/interface/user";
import jwt from "jsonwebtoken";
import {
  arrayBufferToBuffer,
  decryptAES,
  encryptAES,
} from "@/components/encryptions/aes";
import { randomBytes } from "crypto";
import { encryptRC4 } from "@/components/encryptions/rc4";
import { encryptDES } from "@/components/encryptions/des";

export async function createUser(formData: FormData) {
  const iv = randomBytes(16); // put iv on each files
  const income = ((formData.get("income-1") as string) +
    formData.get("income-2")) as string;

  const userData = {
    username: formData.get("name") as string,
    password_AES: encryptAES(formData.get("password") as string, iv) as string,
    aes_iv: iv,

    health_data_RC4: encryptRC4(
      formData.get("health_data") as string
    ) as string,
    // income_DES: encryptDES(income, iv) as string,

    // health_data_RC4: formData.get("health_data") as string,
    income_DES: income as string,
    des_iv: iv,
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
      aes_encrypted: encryptAES(bufferFile, iv) as Buffer,
      aes_iv: iv,
      rc4_encrypted: encryptRC4(bufferFile) as Buffer,
      des_encrypted: Buffer.from("testing"),

      // rc4_encrypted: encryptRC4(bufferFile) as Buffer,
      // des_encrypted: encryptDES(bufferFile, iv) as Buffer,

      des_iv: iv,
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

  let passwordDecrypt = decryptAES(user.password_AES as string, user.aes_iv);
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
  const user = await prisma.user.findFirst();

  return user;
}
