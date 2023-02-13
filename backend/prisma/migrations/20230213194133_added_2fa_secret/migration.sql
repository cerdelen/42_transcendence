/*
  Warnings:

  - Added the required column `two_FA_secret` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "two_FA_secret" TEXT NOT NULL;
