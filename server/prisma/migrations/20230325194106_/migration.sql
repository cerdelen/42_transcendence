-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "conversation_id_arr" INTEGER[],
    "socketId" TEXT NOT NULL DEFAULT '',
    "two_FA_enabled" BOOLEAN NOT NULL DEFAULT false,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "two_FA_secret" TEXT,
    "friendlist" INTEGER[],
    "games" INTEGER[],
    "show_default_image" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Stats" (
    "stat_id" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "loses" INTEGER NOT NULL DEFAULT 0,
    "mmr" INTEGER NOT NULL DEFAULT 1500,
    "achievement_0" BOOLEAN NOT NULL DEFAULT false,
    "achievement_1" BOOLEAN NOT NULL DEFAULT false,
    "achievement_2" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Conversation" (
    "conversation_id" SERIAL NOT NULL,
    "conversation_name" TEXT,
    "conversation_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversation" BOOLEAN NOT NULL DEFAULT true,
    "conversation_is_public" BOOLEAN NOT NULL DEFAULT true,
    "conversation_pass_protected" BOOLEAN NOT NULL DEFAULT false,
    "conversation_password" TEXT,
    "conversation_participant_arr" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "conversation_owner_arr" INTEGER[],
    "conversation_admin_arr" INTEGER[],
    "conversation_black_list_arr" INTEGER[],
    "conversation_mute_list_arr" INTEGER[],
    "group_chat" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("conversation_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "msg_id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversation_id" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("msg_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player_one" INTEGER NOT NULL,
    "player_two" INTEGER NOT NULL DEFAULT 0,
    "winner" INTEGER NOT NULL DEFAULT 0,
    "loser" INTEGER NOT NULL DEFAULT 0,
    "score_one" INTEGER NOT NULL DEFAULT 0,
    "score_two" INTEGER NOT NULL DEFAULT 0,
    "finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_stat_id_key" ON "Stats"("stat_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_conversation_id_key" ON "Conversation"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_msg_id_key" ON "Message"("msg_id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("conversation_id") ON DELETE SET NULL ON UPDATE CASCADE;
