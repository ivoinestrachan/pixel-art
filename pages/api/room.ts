import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rooms = await prisma.room.findMany();
    
    res.status(200).json({ rooms: rooms.map(room => room.roomCode) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}
