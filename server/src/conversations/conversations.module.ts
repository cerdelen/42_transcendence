import { Module } from '@nestjs/common'
import { ConversationController } from './conversations.controller';
import { Services } from 'src/utils/consts'
import { ConversationsService } from './conversations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Chat } from '@prisma/client';
import { ParticipantsModule } from '../participants/participants.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module ({
	imports: [PrismaModule, ParticipantsModule, UserModule],
	controllers: [ConversationController],
	providers: [
		{
			provide: Services.CONVERSATIONS,
			useClass: ConversationsService,
		}
	],
	exports: [
		{
			provide: Services.CONVERSATIONS,
			useClass: ConversationsService
		}
	]
})

export class ConversationModule {}