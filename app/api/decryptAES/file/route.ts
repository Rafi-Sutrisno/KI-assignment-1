import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("AES Decryption Time");
    const { encryptedBuffer, ivAes, key_AES } = await req.json(); // Extract encryptedInput from request body

    if (!encryptedBuffer) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }
    const ivBuf = Buffer.from(ivAes);
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key_AES.data),
      ivBuf
    );
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
