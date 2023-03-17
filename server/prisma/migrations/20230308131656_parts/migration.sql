-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "two_FA_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_FA_secret" TEXT
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "chat_name" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "pass_protected" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "chat_members" INTEGER[],
    "chat_owner" INTEGER NOT NULL,
    "chat_admins" INTEGER[],
    "black_list" INTEGER[],
    "mute_list" INTEGER[],

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_role" (
    "ChatPartsId" SERIAL NOT NULL,

    CONSTRAINT "chat_role_pkey" PRIMARY KEY ("ChatPartsId")
);

-- CreateTable
CREATE TABLE "Message" (
    "msg_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL DEFAULT 0,
    "user_name" TEXT NOT NULL DEFAULT 'default_name',
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_id" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("msg_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_role_ChatPartsId_key" ON "chat_role"("ChatPartsId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_msg_id_key" ON "Message"("msg_id");

-- AddForeignKey
ALTER TABLE "chat_role" ADD CONSTRAINT "chat_role_ChatPartsId_fkey" FOREIGN KEY ("ChatPartsId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
