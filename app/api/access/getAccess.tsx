// pages/api/access/get-access.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Pastikan ada instance Prisma di 'lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query; // ID user yang login

    try {
      // Query untuk mengambil data UserAccess dengan status 1 dan user_owner_id sesuai user yang login
      const accessList = await prisma.userAccess.findMany({
        where: {
          status: 1,
          user_owner_id: userId as string,
        },
        include: {
          user_request: true, // Menyertakan informasi user yang request akses
          file: true, // Menyertakan informasi file yang diakses
        },
      });

      res.status(200).json({ accessList });
    } catch (error) {
      console.error("Error fetching access list:", error);
      res.status(500).json({ error: "Failed to fetch access list" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
