import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { roomCode, displayName } = req.body;

    try {
      const room = await prisma.room.findUnique({
        where: { roomCode: roomCode },
      });

      if (room) {
      
        res.status(200).json({ message: "Joined the room successfully", room });
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to join room" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
