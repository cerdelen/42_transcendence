/*
  Warnings:

  - You are about to drop the column `hashRt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashRt",
ADD COLUMN     "hashedRt" TEXT;
