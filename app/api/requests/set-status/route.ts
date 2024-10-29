import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { createPublicKey, publicEncrypt } from "crypto";
import { createTransport } from "nodemailer";

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  text: string
) => {
  const transporter = createTransport(process.env.NEXT_PUBLIC_EMAIL_CONFIG);

  transporter.verify((err, success) => {
    if (err) console.error(err);
    console.log("Your config is correct");
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
  };

  console.log("ini mail", mailOptions);

  console.log("3");
  return new Promise((resolve, reject) => {
    console.log("masuk promise");
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(true);
      }
    });
  });
};

export async function PATCH(req: Request) {
  const { status, accessID, ownerUsername } = await req.json();

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  // Generates Asymmetric
  const access = await prisma.userAccess.findUnique({
    where: {
      id: accessID,
    },
  });

  const ownerKeys = await prisma.user.findUnique({
    where: {
      id: access?.user_owner_id,
    },
    select: {
      key_AES: true,
      key_DES: true,
      key_RC4: true,
    },
  });

  const requestPublicKey = await prisma.user.findUnique({
    where: {
      id: access?.user_request_id,
    },
    select: {
      email: true,
      publicKey: true,
      privateKey: true,
    },
  });

  let encrypted_key;
  const key = createPublicKey(requestPublicKey!.publicKey); // Ensure public key is defined
  if (access?.method === "AES") {
    encrypted_key = publicEncrypt(key, ownerKeys!.key_AES);
  } else if (access?.method === "RC4") {
    encrypted_key = publicEncrypt(key, ownerKeys!.key_RC4);
  } else {
    encrypted_key = publicEncrypt(key, ownerKeys!.key_DES);
  }

  try {
    await prisma.userAccess.update({
      where: {
        id: accessID,
      },
      data: {
        status: status,
        encrypted_symmetric_key: encrypted_key,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error)
      return NextResponse.json({ error: e.message }, { status: 400 });
  }

  // send the encrypted key via email
  const response = await sendMail(
    ownerUsername,
    requestPublicKey!.email,
    "Your Encryption Key",
    `hello this is the key ${encrypted_key.toString("base64")} `
  );

  return NextResponse.json({ message: response });
}
