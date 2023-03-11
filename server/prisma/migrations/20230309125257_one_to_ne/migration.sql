/*
  Warnings:

  - You are about to drop the column `userId` on the `chat_role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatPtsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "chat_role" DROP CONSTRAINT "chat_role_userId_fkey";

-- DropIndex
DROP INDEX "chat_role_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatPtsId" INTEGER;

-- AlterTable
ALTER TABLE "chat_role" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "User_chatPtsId_key" ON "User"("chatPtsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatPtsId_fkey" FOREIGN KEY ("chatPtsId") REFERENCES "chat_role"("ChatPartId") ON DELETE SET NULL ON UPDATE CASCADE;
