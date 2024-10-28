// pages/api/deleteRequest.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const result = await prisma.userAccess.delete({
      where: {
        id : String(requestId),
      }
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
