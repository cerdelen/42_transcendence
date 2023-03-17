/*
  Warnings:

  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Chat` table. All the data in the column will be lost.
  - The primary key for the `chat_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ChatPartsId` on the `chat_role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chat_id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChatPartId]` on the table `chat_role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "chat_role" DROP CONSTRAINT "chat_role_ChatPartsId_fkey";

-- DropIndex
DROP INDEX "Chat_id_key";

-- DropIndex
DROP INDEX "chat_role_ChatPartsId_key";

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
DROP COLUMN "id",
ADD COLUMN     "chat_id" SERIAL NOT NULL,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_id");

-- AlterTable
ALTER TABLE "chat_role" DROP CONSTRAINT "chat_role_pkey",
DROP COLUMN "ChatPartsId",
ADD COLUMN     "ChatPartId" SERIAL NOT NULL,
ADD CONSTRAINT "chat_role_pkey" PRIMARY KEY ("ChatPartId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chat_id_key" ON "Chat"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_role_ChatPartId_key" ON "chat_role"("ChatPartId");

-- AddForeignKey
ALTER TABLE "chat_role" ADD CONSTRAINT "chat_role_ChatPartId_fkey" FOREIGN KEY ("ChatPartId") REFERENCES "Chat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
