import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("AES Decryption Time");
    const { encryptedBuffer, ivAes } = await req.json(); // Extract encryptedInput from request body
    const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    const key = Buffer.from(encryptionKeyHex!, "hex");

    if (!encryptedBuffer) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }
    const ivBuf = Buffer.from(ivAes);
    const decipher = createDecipheriv("aes-256-cbc", key, ivBuf);
    let decrypted = decipher.update(
      Buffer.from(new Uint8Array(encryptedBuffer.data))
    );

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log("Decrypted data: ", decrypted);
    console.timeEnd("AES Decryption Time");
    return NextResponse.json({ decrypted });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json({ error: "Decryption failed." }, { status: 500 });
  }
}
