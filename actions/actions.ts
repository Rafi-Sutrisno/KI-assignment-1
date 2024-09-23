"use server";

import prisma from "@/lib/db";
import { UserLoginParams } from "@/interface/user";
import jwt from "jsonwebtoken";
import { arrayBufferToBuffer, encrypt } from "@/components/encryptions/aes";
import { randomBytes } from "crypto";

export async function createUser(formData: FormData) {
  const userData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone_number: formData.get("phone") as string,
    address: formData.get("address") as string,
    password: formData.get("password") as string,
  };

  const file = formData.get("file_input") as File;
  const arrayBuffer = await file.arrayBuffer();
  const bufferFile = arrayBufferToBuffer(arrayBuffer);
  const iv = randomBytes(16); // put iv on each files

  const user = await prisma.user.create({ data: userData });

  const userFile = await prisma.userFiles.create({
    data: {
      userId: user.id,
      fileType: file.type,
      aes_encrypted: encrypt(bufferFile, iv),
      aes_iv: iv,
      rc4_encrypted: Buffer.from("dummy_aes_encrypted_data"),
      des_encrypted: Buffer.from("dummy_aes_encrypted_data"),
    },
  });

  return { user, userFile };
}

export async function userLogin(params: UserLoginParams) {
  const { email, password } = params;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== password) {
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
