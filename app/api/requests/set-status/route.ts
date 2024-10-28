import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import {
  createPrivateKey,
  createPublicKey,
  privateDecrypt,
  publicEncrypt,
} from "crypto";
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
  const { status, accessID, ownerUsername, targetUsername } = await req.json();

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  try {
    await prisma.userAccess.update({
      where: {
        id: accessID,
      },
      data: {
        status: status,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error)
      return NextResponse.json({ error: e.message }, { status: 400 });
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

  let private_key;

  if (requestPublicKey?.privateKey) {
    try {
      private_key = createPrivateKey({
        key: requestPublicKey.privateKey, // Ensure this is in PEM format
        format: "pem",
        type: "pkcs8", // Matches the key type when stored
        passphrase: "process.env.NEXT_PUBLIC_PASSPHRASE", // Use the correct passphrase used during key generation
      });
    } catch (err) {
      console.error("Error creating private key:", err);
      throw new Error("Invalid private key");
    }
  } else {
    throw new Error("Private key not found for the user");
  }

  if (!private_key) {
    throw new Error("Private key could not be created");
  }

  // Now that we are sure private_key is defined, use it in privateDecrypt
  const decrypted_key = privateDecrypt(private_key, encrypted_key);

  // send the encrypted key via email
  const response = await sendMail(
    ownerUsername,
    targetUsername,
    "Your Encryption Key",
    `hello this is the key ${encrypted_key.toString(
      "base64"
    )} \n\n ${ownerKeys!.key_AES.toString("base64")} \n\n 
    ${decrypted_key.toString("base64")}`
  );

  return NextResponse.json({ message: response });
}
