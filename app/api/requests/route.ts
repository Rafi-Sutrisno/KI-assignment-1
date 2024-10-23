import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userReqID, userOwnerID, fileID, method } = await req.json();
  const initialRequest = {
    user_request_id: userReqID,
    user_owner_id: userOwnerID,
    file_id: fileID,
    status: 0,
    method: method,
  };
  try {
    await prisma.userAccess.create({ data: initialRequest });
    return NextResponse.json({ message: "success to create initial request" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
