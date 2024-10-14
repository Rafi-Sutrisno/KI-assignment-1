import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("AES Decryption Time");
    const { encryptedInput, ivAes } = await req.json(); // Extract encryptedInput from request body
    const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    const key = Buffer.from(encryptionKeyHex!, "hex");

    if (!encryptedInput) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }
    const ivBuf = Buffer.from(ivAes);
    const decipher = createDecipheriv("aes", key, ivBuf); // No IV for RC4
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
