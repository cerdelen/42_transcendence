import { UseGuards, Controller, Post, Inject, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Routes, Services } from '../utils/consts';
// import { AuthenticateGuard } from '../utils/Guards';
import { IConversationsService } from './conversations';
import { CreateConversationDto } from './dto/CreateConversation.dto';
import { AuthUser } from 'src/utils/decorators';
import { User, ChatParticipants } from '@prisma/client';
// import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { IsNumber } from 'class-validator';



@Controller(Routes.CONVERSATIONS)

// @UseGuards(AuthenticateGuard)
export class ConversationController {

	constructor(
		@Inject(Services.CONVERSATIONS) private readonly conversationsService: IConversationsService,
		@Inject(Services.USERS) private readonly UserService: UserService, 
		) {

	}

	@Post()
	async createConversation(
		@AuthUser() user: User, 
		@Body() createConversationPayload: CreateConversationDto) { 
		try {
			// const userDB = await this.UserService.findUserById({id : user.id})
			// console.log(userDB); 
			this.conversationsService.createConversation(user, createConversationPayload);
			// this.conversationsService.createConversation(createConversationPayload);
		}
		catch( err )
		{
			console.log(err);
			throw new Error('An error occurred while creating a conversation');
		} 
	} 
}