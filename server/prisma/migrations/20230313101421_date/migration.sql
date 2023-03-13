/*
  Warnings:

  - The `conversation_created_at` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "conversation_created_at",
ADD COLUMN     "conversation_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
