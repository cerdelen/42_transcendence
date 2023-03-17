/*
  Warnings:

  - A unique constraint covering the columns `[PartsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `chat_role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `PartsId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `chat_role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PartsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "chat_role" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_PartsId_key" ON "User"("PartsId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_role_userId_key" ON "chat_role"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_PartsId_fkey" FOREIGN KEY ("PartsId") REFERENCES "chat_role"("ChatPartsId") ON DELETE RESTRICT ON UPDATE CASCADE;
