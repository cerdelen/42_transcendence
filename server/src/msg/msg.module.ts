import { Module } from "@nestjs/common";
import { MsgController } from './msg.controller';
import { MsgService } from './msg.service';
import { ConversationModule } from '../conversations/conversations.module';
import { PrismaModule } from '../prisma/prisma.module';
import { Message } from '../messages/entities/message.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversations/conversations.service';
import { PrismaService } from '../prisma/prisma.service';



@Module({
	imports: [ConversationModule, PrismaModule, UserModule],
	controllers: [MsgController],
	providers: [ PrismaService, MsgService, UserService],
	// exports: [MsgService]
})


export class MsgModule {}