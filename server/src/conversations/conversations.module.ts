import { Module } from '@nestjs/common'
import { ConversationController } from './conversations.controller';
import { Services } from 'src/utils/consts'
import { ConversationService } from './conversations.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { ParticipantsModule } from '../participants/participants.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationGateway } from './conversation.gateway';
import { MsgModule } from '../msg/msg.module';
import { MsgService } from '../msg/msg.service';

@Module ({
	imports: [PrismaModule, UserModule],
	controllers: [ConversationController],
	providers: [PrismaService, UserService, ConversationService],
	exports: [ConversationService]
	// providers: [
	// 	{
	// 		provide: Services.CONVERSATIONS,
	// 		useClass: ConversationsService,
	// 	}
	// ],
})

export class ConversationModule {}