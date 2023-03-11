/*
  Warnings:

  - You are about to drop the column `conversation_admins` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_black_list` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_mute_list` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_owner` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_participants` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversartion_id` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_conversartion_id_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "conversation_admins",
DROP COLUMN "conversation_black_list",
DROP COLUMN "conversation_mute_list",
DROP COLUMN "conversation_owner",
DROP COLUMN "conversation_participants",
ADD COLUMN     "conversation_admin_arr" INTEGER[],
ADD COLUMN     "conversation_black_list_arr" INTEGER[],
ADD COLUMN     "conversation_mute_list_arr" INTEGER[],
ADD COLUMN     "conversation_owner_arr" INTEGER[],
ADD COLUMN     "conversation_participant_arr" INTEGER[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "conversartion_id",
ADD COLUMN     "conversation_id_arr" INTEGER[];
