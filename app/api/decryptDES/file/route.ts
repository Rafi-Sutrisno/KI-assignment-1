import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("DES Decryption Time");
    const { encryptedBuffer, ivDes, key_DES } = await req.json(); // Extract encryptedInput from request body

    if (!encryptedBuffer) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }

    const ivBuf = Buffer.from(ivDes);
    const decipher = createDecipheriv("des", Buffer.from(key_DES.data), ivBuf); // No IV for RC4
    let decrypted = decipher.update(
      Buffer.from(new Uint8Array(encryptedBuffer.data))
    );
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    console.log("Decrypted data: ", decrypted);
    console.timeEnd("DES Decryption Time");
    return NextResponse.json({ decrypted });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json({ error: "Decryption failed." }, { status: 500 });
  }
}
