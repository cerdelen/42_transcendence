/*
  Warnings:

  - You are about to drop the column `usr_id` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "usr_id",
ADD COLUMN     "author" INTEGER;
