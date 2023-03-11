import { UseGuards, Controller, Post, Inject, Body, UsePipes, ValidationPipe, Req, Get } from '@nestjs/common';
import { Routes, Services } from '../utils/consts';
// import { AuthenticateGuard } from '../utils/Guards';
import { IConversationsService } from './conversations';
import { CreateConversationDto } from './dto/CreateConversation.dto';
import { AuthUser } from 'src/utils/decorators';
import { User, ChatParticipant, Chat } from '@prisma/client';
// import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { IsNumber } from 'class-validator';
import { Jwt_Auth_Guard } from '../auth/guards/jwt_auth.guard';
import { ConversationsService } from './conversations.service';




// @UseGuards(AuthenticateGuard)
@Controller(Routes.CONVERSATIONS)

export class ConversationController {

	constructor(
		@Inject(Services.CONVERSATIONS) private readonly conversationsService: IConversationsService,
		// @Inject(Services.USERS) private readonly UserService: UserService, 
		) {

	}

	@UseGuards(Jwt_Auth_Guard)
	@Post()
	async createConversation(@Req() _req: any,
		@AuthUser() user: User,
		@Body() createConversationPayload: CreateConversationDto) { 
			console.log("USER = " + user);
			console.log("USERfrom request = " + _req.user.id);
			console.log(createConversationPayload);
			
			this.conversationsService.createConversation(user, createConversationPayload)
			// console.log("USER " + user.name);
		// if (!user || !user.id)
		// 	throw new Error("Invalid user ID")
		// try {
		// 	const userDB = await this.UserService.findUserById(user.id)
		// 	console.log(userDB);    
			// this.conversationsService.createConversation(user, createConversationPayload);
			// this.conversationsService.createConversation(createConversationPayload);
		// }
		// catch( err )
		// {
		// 	console.log(err);
		// 	throw new Error('An error occurred while creating a conversation');
		// }   
	} 
	@Get()
	getConversations() {
		return this.ConversationsService.find()
	}

}