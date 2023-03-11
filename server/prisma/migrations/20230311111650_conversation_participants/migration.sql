/*
  Warnings:

  - You are about to drop the column `conversation_members` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "conversation_members",
ADD COLUMN     "conversation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "conversation_participants" INTEGER[];
