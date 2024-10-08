import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    const { encryptedBuffer } = await req.json(); // Extract encryptedInput from request body
    const encryptionKeyHex = "3f27cb95e2d8d29600ca4e860a1f3ca3";
    const key = Buffer.from(encryptionKeyHex, "hex");
    console.log("ini eB post: ", encryptedBuffer);
    if (!encryptedBuffer) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }
    const decipher = createDecipheriv("rc4", key, null); // No IV for RC4
    let decrypted = decipher.update(
      Buffer.from(new Uint8Array(encryptedBuffer.data))
    );
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    console.log("Decrypted data: ", decrypted);
    return NextResponse.json({ decrypted });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json({ error: "Decryption failed." }, { status: 500 });
  }
}
