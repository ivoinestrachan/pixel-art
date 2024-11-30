import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomCode } = req.query;

  if (!roomCode || !/^\d{4}$/.test(String(roomCode))) {
    return res.status(400).json({ error: "Room code is required and must be a 4-digit number." });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { roomCode: String(roomCode) },
      include: {
        players: true,
        creator: {
          select: {
            displayName: true,
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const players = room.players.map((player) => ({
      id: player.id,
      displayName: player.displayName,
    }));

    return res.status(200).json({
      players: players,
      creator: room.creator?.displayName || null,
    });
  } catch (error: any) {
    console.error(`Error fetching room for roomCode: ${roomCode}`, error.message);
    return res.status(500).json({ error: "Failed to fetch room data." });
  }
}
