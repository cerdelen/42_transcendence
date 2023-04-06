import { Module } from '@nestjs/common'
import { ConversationController } from './conversations.controller';
import { Services } from 'src/utils/consts'
import { ConversationService } from './conversations.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { ParticipantsModule } from '../participants/participants.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

import { MsgModule } from '../msg/msg.module';
import { MsgService } from '../msg/msg.service';
import { conversationGateway } from './conversationSocket/conversation.gateway';
import { new_user_gateway_module } from 'src/user/userSocket/new_user.gateway.module';
// import { conversationGateway } from './conversationSocket/conversation.gateway';

@Module ({
	imports: [PrismaModule, UserModule, new_user_gateway_module],
	controllers: [ConversationController],
	// providers: [PrismaService, UserService, ConversationService],
	providers: [PrismaService, UserService, ConversationService, conversationGateway],
	exports: [ConversationService]
})

export class ConversationModule {}