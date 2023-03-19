import { Module } from "@nestjs/common";
import { MsgService } from './msg.service';
import { ConversationModule } from '../conversations/conversations.module';
import { PrismaModule } from '../prisma/prisma.module';
import { Message } from '../messages/entities/message.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversations/conversations.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { GatewayModule } from '../gateway/gateway.module';


@Module({
	imports: [ConversationModule, PrismaModule, UserModule],
	// controllers: [MsgController],
	providers: [ PrismaService, MsgService, UserService, EventEmitter2],
	exports: [MsgService]
})


export class MsgModule {}