/*
  Warnings:

  - You are about to drop the column `user_id_creator` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_recipient` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user_id_creator_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user_id_recipient_fkey";

-- DropIndex
DROP INDEX "Conversation_user_id_creator_key";

-- DropIndex
DROP INDEX "Conversation_user_id_recipient_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "user_id_creator",
DROP COLUMN "user_id_recipient";
