import { Module } from "@nestjs/common";
import { ConversationModule } from "src/conversations/conversations.module";
import { ConversationService } from "src/conversations/conversations.service";
import { MsgModule } from "src/msg/msg.module";
import { MsgService } from "src/msg/msg.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MessagingGateway } from "../msg/msgSocket/websocket.gateway";

@Module({
	imports: [MsgModule, ConversationModule],
	providers: [PrismaService, MessagingGateway]
})

export class GatewayModule{}