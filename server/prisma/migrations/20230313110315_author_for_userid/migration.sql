/*
  Warnings:

  - You are about to drop the column `user_id` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[author]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_user_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "user_id";

-- CreateIndex
CREATE UNIQUE INDEX "Message_author_key" ON "Message"("author");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
