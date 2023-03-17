/*
  Warnings:

  - You are about to drop the column `chat_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `chatPtsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatToChatParticipant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[conversartion_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatPtsId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToChatParticipant" DROP CONSTRAINT "_ChatToChatParticipant_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToChatParticipant" DROP CONSTRAINT "_ChatToChatParticipant_B_fkey";

-- DropIndex
DROP INDEX "User_chatPtsId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chat_id",
ADD COLUMN     "conversation_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatPtsId",
ADD COLUMN     "conversartion_id" INTEGER;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatParticipant";

-- DropTable
DROP TABLE "_ChatToChatParticipant";

-- CreateTable
CREATE TABLE "Conversation" (
    "conversation_id" SERIAL NOT NULL,
    "conversation_name" TEXT,
    "conversation_is_public" BOOLEAN NOT NULL DEFAULT true,
    "conversation_pass_protected" BOOLEAN NOT NULL DEFAULT false,
    "conversation_password" TEXT,
    "conversation_members" INTEGER[],
    "conversation_owner" INTEGER NOT NULL,
    "conversation_admins" INTEGER[],
    "conversation_black_list" INTEGER[],
    "conversation_mute_list" INTEGER[],

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("conversation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_conversation_id_key" ON "Conversation"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_conversartion_id_key" ON "User"("conversartion_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("conversation_id") ON DELETE SET NULL ON UPDATE CASCADE;
