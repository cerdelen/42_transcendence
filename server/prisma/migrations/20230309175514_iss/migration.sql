/*
  Warnings:

  - Made the column `chatPtsId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatPtsId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "chatPtsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatPtsId_fkey" FOREIGN KEY ("chatPtsId") REFERENCES "ChatParticipant"("ChatPartId") ON DELETE RESTRICT ON UPDATE CASCADE;
