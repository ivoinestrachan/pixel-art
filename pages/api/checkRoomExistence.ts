import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomCode } = req.query;

  if (!roomCode || typeof roomCode !== 'string' || roomCode.length !== 4) {
    return res.status(400).json({ error: 'Invalid room code.' });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { roomCode: roomCode },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json({ message: 'Room exists' });
  } catch (error) {
    console.error('Error checking room existence:', error);
    res.status(500).json({ error: 'Failed to check room existence. Please try again later.' });
  }
}
