import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  try {
    const userAccessList = await prisma.userAccess.findMany({
      where: {
        status: 1,
        user_owner_id: userId as string,
      },
      include: {
        user_request: {
          select: { name: true },
        },
      },
    });
    res.status(200).json(userAccessList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user access data.' });
  }
}
