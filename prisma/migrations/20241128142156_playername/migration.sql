/*
  Warnings:

  - A unique constraint covering the columns `[roomId,displayName]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_roomId_displayName_key" ON "Player"("roomId", "displayName");
