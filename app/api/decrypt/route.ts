import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

export async function POST(req: Request) {
  try {
    console.time("RC4 Decryption Time");
    const { encryptedInput, key_RC4 } = await req.json(); // Extract encryptedInput from request body

    if (!encryptedInput) {
      return NextResponse.json(
        { error: "No encrypted input provided." },
        { status: 400 }
      );
    }

    const decipher = createDecipheriv("rc4", Buffer.from(key_RC4.data), null); // No IV for RC4
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
