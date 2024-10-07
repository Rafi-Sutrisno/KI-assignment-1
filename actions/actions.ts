"use server";

import prisma from "@/lib/db";
import { UserLoginParams } from "@/interface/user";
import jwt from "jsonwebtoken";
import { arrayBufferToBuffer, encryptAES } from "@/components/encryptions/aes";
import { randomBytes } from "crypto";
import { encryptRC4 } from "@/components/encryptions/rc4";

export async function createUser(formData: FormData) {
  let phoneNumber = formData.get("phone") as string;
  if (!phoneNumber.startsWith("+62")) {
    phoneNumber = "+62" + phoneNumber;
  }

  const userData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone_number: phoneNumber,
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
      fileName: file.name,
      aes_encrypted: encryptAES(bufferFile, iv) as Buffer,
      aes_iv: iv,
      rc4_encrypted: encryptRC4(bufferFile) as Buffer,
      // rc4_encrypted: Buffer.from("dummy_rc4"),
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
