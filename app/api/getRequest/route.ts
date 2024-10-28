// pages/api/getRequest.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const ownerId = searchParams.get("ownerId");
  const userReqId = searchParams.get("userReqId");

  try {
    let result;
    if (ownerId) {
      result = await prisma.userAccess.findMany({
        where: {
          user_owner_id: ownerId,
          status: 0,
        },
        include: {
          user_owner: true,
          user_request: true,
          file: true,
        },
      });
    } else if (userReqId) {
      result = await prisma.userAccess.findMany({
        where: {
          user_request_id: userReqId,
        },
        include: {
          user_owner: true,
          user_request: true,
          file: true,
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
