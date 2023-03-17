-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatPtsId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "chatPtsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatPtsId_fkey" FOREIGN KEY ("chatPtsId") REFERENCES "ChatParticipant"("ChatPartId") ON DELETE SET NULL ON UPDATE CASCADE;
