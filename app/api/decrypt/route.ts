import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("RC4 Decryption Time");
    const { encryptedInput } = await req.json(); // Extract encryptedInput from request body
    const encryptionKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_RC4_KEY;
    const key = Buffer.from(encryptionKeyHex!, "hex");

    if (!encryptedInput) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }

    const decipher = createDecipheriv("rc4", key, null); // No IV for RC4
    let decrypted = decipher.update(encryptedInput, "hex", "utf8");
    decrypted += decipher.final("utf8");

    console.log("Decrypted data: ", decrypted);
    console.timeEnd("RC4 Decryption Time");
    return NextResponse.json({ decrypted });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json({ error: "Decryption failed." }, { status: 500 });
  }
}
