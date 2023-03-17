/*
  Warnings:

  - A unique constraint covering the columns `[user_id_creator]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id_recipient]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id_creator` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id_recipient` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "user_id_creator" INTEGER NOT NULL,
ADD COLUMN     "user_id_recipient" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user_id_creator_key" ON "Conversation"("user_id_creator");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user_id_recipient_key" ON "Conversation"("user_id_recipient");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_creator_fkey" FOREIGN KEY ("user_id_creator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_recipient_fkey" FOREIGN KEY ("user_id_recipient") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
