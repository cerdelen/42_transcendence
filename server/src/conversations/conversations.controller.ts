import { UseGuards, Post, Inject, Body, UsePipes, ValidationPipe, Req, Get, Controller } from '@nestjs/common';
import { Routes, Services } from '../utils/consts';
// import { AuthenticateGuard } from '../utils/Guards';
// import { IConversationsService } from './conversations';
import { CreateConversationDto } from './dto/CreateConversation.dto';
import { AuthUser } from 'src/utils/decorators';
import { User, Conversation } from '@prisma/client';
// import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { IsNumber } from 'class-validator';
import { Jwt_Auth_Guard } from '../auth/guards/jwt_auth.guard';
import { ConversationService } from './conversations.service';
import { ConversationModule } from './conversations.module';
import { userInfo } from 'os';
import { request } from 'http';
import { PrismaService } from '../prisma/prisma.service';




@Controller()
export class ConversationController {
	constructor (
		private readonly conversationsService: ConversationService,
		private readonly userService: UserService) {}


	@UseGuards(Jwt_Auth_Guard)
	@Post('conversation/create')
	async createConversation(
		@Req() 
		req : any,
		@Body() userContent: {
			name?: string;
			chat?: boolean;
			public?: boolean;
			password?: boolean;
			request?: boolean;
			participants: string[],
		}) 
		{
			if (typeof userContent.participants === "undefined")
				return null;
			let array : number[] = [];
			let user : User;
			for (let i = 0; i < userContent.participants.length; ++i)
			{
				let chat_member: number = Number(userContent.participants[i])
				user = await this.userService.findUserById(chat_member);
				if(user)
					array.push(chat_member);
			}
			
			let newConversation : Conversation = await this.conversationsService.createConversation({
				conversation_name: userContent.name,
				conversation_participant_arr: array,
				conversation_owner_arr: [Number(req.user.id)],
				conversation_admin_arr: [Number(req.user.id)]
			})
			for (let i = 0; i < array.length; ++i)
			{
				user = await this.userService.findUserById(array[i]);
				await user.conversation_id_arr.push(newConversation.conversation_id);
				await this.userService.updateUser({
					where: {
						id: array[i],
					},
					data: {
						conversation_id_arr: user.conversation_id_arr,
					}
				})	
			}
			return newConversation;
		}

		@UseGuards(Jwt_Auth_Guard)
		@Post('conversation/join')
		async joinConversation(
			@Req() req: any,	
			@Body() userContent: {
				conversation_id_arr: number,
				password: string
			}
		): Promise<User> {
			console.log(userContent);
			const conversationId = userContent.conversation_id_arr;
			const existingConversation = await this.conversationsService.findConversation(userContent.conversation_id_arr)
			const userIdx = existingConversation.conversation_participant_arr.indexOf(req.user.id);
			if (userIdx < 0) return null;
			await this.conversationsService.updateConversation({
				where: {
					conversation_id: Number(userContent.conversation_id_arr)
				},
				data: {
					conversation_participant_arr: {
						push: Number(req.user.id)
					}
				}
			}) 
			const updatedUser = await this.userService.updateUser({
				where: {
					id : Number(req.user.id)
				},
				data: {         
					conversation_id_arr: {
						push: Number(userContent.conversation_id_arr)
					}
				}
			})
			return updatedUser
		} 
		


}




// // @UseGuards(AuthenticateGuard)
// @Controller(Routes.CONVERSATIONS)

// export class ConversationController {

// 	constructor(
// 		@Inject(Services.CONVERSATIONS) private readonly conversationsService: IConversationsService,
// 		// @Inject(Services.USERS) private readonly UserService: UserService, 
// 		) {

// 	}

// 	@UseGuards(Jwt_Auth_Guard)
// 	@Post()
// 	async createConversation(@Req() _req: any,
// 		@AuthUser() user: User,
// 		@Body() createConversationPayload: CreateConversationDto) { 
// 			console.log("USER = " + user);
// 			console.log("USERfrom request = " + _req.user.id);
// 			console.log(createConversationPayload);
			
// 			this.conversationsService.createConversation(user, createConversationPayload)
// 			// console.log("USER " + user.name);
// 		// if (!user || !user.id)
// 		// 	throw new Error("Invalid user ID")
// 		// try {
// 		// 	const userDB = await this.UserService.findUserById(user.id)
// 		// 	console.log(userDB);    
// 			// this.conversationsService.createConversation(user, createConversationPayload);
// 			// this.conversationsService.createConversation(createConversationPayload);
// 		// }
// 		// catch( err )
// 		// {
// 		// 	console.log(err);
// 		// 	throw new Error('An error occurred while creating a conversation');
// 		// }   
// 	} 
// 	@Get()
// 	getConversations() {
// 		return this.ConversationsService.find()
// 	}