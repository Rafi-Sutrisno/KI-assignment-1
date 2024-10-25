// pages/api/getRequest.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const ownerId = searchParams.get("ownerId");
  const status = searchParams.get("status");

  if (!ownerId) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  if (!status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  try {
    const result = await prisma.userAccess.findMany({
      where: {
        user_owner_id: String(ownerId),
        status: Number(status)
      },
      include: {
        user_request: true,
        file: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
