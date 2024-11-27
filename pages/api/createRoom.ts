import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { roomCode, displayName } = req.body;


    if (!roomCode || !displayName) {
      return res.status(400).json({ error: 'Room code and display name are required.' });
    }

    try {
      const newRoom = await prisma.room.create({
        data: {
          roomCode: roomCode,
          displayName: displayName,
        },
      });
      res.status(200).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create room' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
