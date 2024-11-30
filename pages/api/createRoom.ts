import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, displayName } = req.body;

  if (!roomCode || !displayName) {
    return res.status(400).json({ error: "Room code and display name are required." });
  }

  try {
    const creator = await prisma.user.findUnique({
      where: { displayName },
    });

    if (!creator) {
      const newUser = await prisma.user.create({
        data: { displayName },
      });

      const newRoom = await prisma.room.create({
        data: {
          roomCode,
          creatorId: newUser.id,
          players: {
            create: [{ userId: newUser.id, displayName: newUser.displayName }],
          },
        },
      });

      return res.status(201).json({ message: "Room created successfully.", room: newRoom });
    }

    const existingRoom = await prisma.room.findUnique({
      where: { roomCode },
    });

    if (existingRoom) {
      return res.status(400).json({ error: "Room code already exists." });
    }

    const newRoom = await prisma.room.create({
      data: {
        roomCode,
        creatorId: creator.id,
        players: {
          create: [{ userId: creator.id, displayName: creator.displayName }],
        },
      },
    });

    return res.status(201).json({ message: "Room created successfully.", room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
