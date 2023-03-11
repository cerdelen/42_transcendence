/*
  Warnings:

  - You are about to drop the column `chatPtsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `chat_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatPtsId_fkey";

-- DropForeignKey
ALTER TABLE "chat_role" DROP CONSTRAINT "chat_role_ChatPartId_fkey";

-- DropIndex
DROP INDEX "User_chatPtsId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatPtsId";

-- DropTable
DROP TABLE "chat_role";

-- CreateTable
CREATE TABLE "ChatParticipant" (
    "ChatPartId" SERIAL NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("ChatPartId")
);

-- CreateTable
CREATE TABLE "_ChatToChatParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_ChatPartId_key" ON "ChatParticipant"("ChatPartId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_userId_key" ON "ChatParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToChatParticipant_AB_unique" ON "_ChatToChatParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToChatParticipant_B_index" ON "_ChatToChatParticipant"("B");

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToChatParticipant" ADD CONSTRAINT "_ChatToChatParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToChatParticipant" ADD CONSTRAINT "_ChatToChatParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "ChatParticipant"("ChatPartId") ON DELETE CASCADE ON UPDATE CASCADE;
