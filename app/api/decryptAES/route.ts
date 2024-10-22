import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("AES Decryption Time");
    const { encryptedInput, aes_iv, key_AES } = await req.json(); // Extract encryptedInput from request body
    console.log("ini encrypted input: ", encryptedInput);
    if (!encryptedInput) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }
    const ivBuf = Buffer.from(aes_iv);
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key_AES.data),
      ivBuf
    ); // No IV for RC4
    let decrypted = decipher.update(encryptedInput, "hex", "utf8");
    decrypted += decipher.final("utf8");

    console.log("Decrypted data: ", decrypted);
    console.timeEnd("AES Decryption Time");
    return NextResponse.json({ decrypted });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json({ error: "Decryption failed." }, { status: 500 });
  }
}
