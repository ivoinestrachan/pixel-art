import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomCode, displayName } = req.body;

  if (!roomCode || !displayName) {
    return res.status(400).json({ error: 'Room code and display name are required.' });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { roomCode },
      include: { players: true },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const existingPlayer = room.players.find(player => player.displayName === displayName);
    if (existingPlayer) {
      return res.status(400).json({ error: 'You are already in this room.' });
    }

    const user = await prisma.user.upsert({
      where: { displayName },
      update: {}, 
      create: { displayName }, 
    });

    await prisma.player.create({
      data: {
        displayName,
        roomId: room.id,
        userId: user.id, 
      },
    });

    res.status(200).json({ message: 'Successfully joined the room.' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room. Please try again later.' });
  }
}
