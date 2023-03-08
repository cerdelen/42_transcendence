/*
  Warnings:

  - You are about to drop the column `PartsId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PartsId_fkey";

-- DropIndex
DROP INDEX "User_PartsId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "PartsId";

-- AddForeignKey
ALTER TABLE "chat_role" ADD CONSTRAINT "chat_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
