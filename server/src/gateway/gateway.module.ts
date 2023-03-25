import { Module } from "@nestjs/common";
import { ConversationModule } from "src/conversations/conversations.module";
import { ConversationService } from "src/conversations/conversations.service";
import { conversationGateway } from "src/conversations/conversationSocket/conversation.gateway";
import { MsgModule } from "src/msg/msg.module";
import { MsgService } from "src/msg/msg.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MessagingGateway } from "../msg/msgSocket/websocket.gateway";

@Module({
	imports: [MsgModule, ConversationModule, ConversationModule],
	providers: [PrismaService, MessagingGateway, conversationGateway]
})

export class GatewayModule{}