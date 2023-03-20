/*
  Warnings:

  - You are about to drop the column `user_name` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "group_chat" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "user_name";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendlist" INTEGER[],
ADD COLUMN     "games" INTEGER[],
ADD COLUMN     "show_default_image" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Stats" (
    "stat_id" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "loses" INTEGER NOT NULL DEFAULT 0,
    "mmr" INTEGER NOT NULL DEFAULT 1500,
    "achievement_0" BOOLEAN NOT NULL DEFAULT false,
    "achievement_1" BOOLEAN NOT NULL DEFAULT false,
    "achievement_2" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player_one" INTEGER NOT NULL,
    "player_two" INTEGER NOT NULL DEFAULT 0,
    "winner" INTEGER NOT NULL DEFAULT 0,
    "loser" INTEGER NOT NULL DEFAULT 0,
    "score_one" INTEGER NOT NULL DEFAULT 0,
    "score_two" INTEGER NOT NULL DEFAULT 0,
    "finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stats_stat_id_key" ON "Stats"("stat_id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
