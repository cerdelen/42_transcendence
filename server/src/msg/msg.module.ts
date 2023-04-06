import { Module } from "@nestjs/common";
import { MsgService } from './msg.service';
import { ConversationModule } from '../conversations/conversations.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { MessagingGateway } from "./msgSocket/websocket.gateway";
import { new_user_gateway_module } from "src/user/userSocket/new_user.gateway.module";


@Module({
	imports: [new_user_gateway_module, ConversationModule, PrismaModule, UserModule],
	// controllers: [MsgController],
	providers: [PrismaService, MsgService, UserService, EventEmitter2, MessagingGateway],
	exports: [MsgService]
})


export class MsgModule {}