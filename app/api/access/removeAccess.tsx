import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessId } = req.body;

  try {
    await prisma.userAccess.delete({
      where: { id: accessId },
    });
    res.status(200).json({ message: 'Access removed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove access.' });
  }
}
