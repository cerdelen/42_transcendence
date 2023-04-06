import { Module } from '@nestjs/common'
import { ConversationController } from './conversations.controller';
import { ConversationService } from './conversations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { conversationGateway } from './conversationSocket/conversation.gateway';
import { new_user_gateway_module } from 'src/user/userSocket/new_user.gateway.module';

@Module ({
	imports: [PrismaModule, UserModule, new_user_gateway_module],
	controllers: [ConversationController],
	providers: [PrismaService, UserService, ConversationService, conversationGateway],
	exports: [ConversationService]
})

export class ConversationModule {}