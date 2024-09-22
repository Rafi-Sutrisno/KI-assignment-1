"use server";

import prisma from "@/lib/db";

export async function createUser(formData: FormData) {
  const userData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone_number: formData.get("phone") as string,
    address: formData.get("address") as string,
    password: formData.get("password") as string,
  };

  const file = formData.get("file_input") as File;

  const user = await prisma.user.create({ data: userData });

  const userFile = await prisma.userFiles.create({
    data: {
      userId: user.id, // Use the ID from the created user
      fileType: file.type,
      aes_encrypted: Buffer.from("dummy_aes_encrypted_data"),
      rc4_encrypted: Buffer.from("dummy_aes_encrypted_data"),
      des_encrypted: Buffer.from("dummy_aes_encrypted_data"),
    },
  });

  return { user, userFile };
}
