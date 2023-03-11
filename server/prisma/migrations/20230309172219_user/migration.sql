/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatPtsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_userId_fkey";

-- DropIndex
DROP INDEX "ChatParticipant_userId_key";

-- AlterTable
ALTER TABLE "ChatParticipant" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatPtsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_chatPtsId_key" ON "User"("chatPtsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatPtsId_fkey" FOREIGN KEY ("chatPtsId") REFERENCES "ChatParticipant"("ChatPartId") ON DELETE SET NULL ON UPDATE CASCADE;
