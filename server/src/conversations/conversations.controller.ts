import { UseGuards, Post, Inject, Body, UsePipes, ValidationPipe, Req, Get, Controller, Param, Put, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { Routes, Services } from '../utils/consts';
// import { AuthenticateGuard } from '../utils/Guards';
// import { IConversationsService } from './conversations';
import { AuthUser } from 'src/utils/decorators';
import { User, Conversation, Prisma } from '@prisma/client';
// import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { IsNumber } from 'class-validator';
import { Jwt_Auth_Guard } from '../auth/guards/jwt_auth.guard';
import { ConversationService } from './conversations.service';
import { ConversationModule } from './conversations.module';
import { userInfo } from 'os';
import { request } from 'http';
import { PrismaService } from '../prisma/prisma.service';
import { conversationGateway } from './conversationSocket/conversation.gateway';
import { Two_FA_Guard } from 'src/two_fa/guard/two_fa.guard';
import { hashPassword } from 'src/utils/hash_passwrd';
import { comparePassword } from '../utils/hash_passwrd';


@Controller('conversation')
export class ConversationController {
	constructor (
		private readonly conversationsService: ConversationService,
		private readonly userService: UserService,
		private readonly convGateway: conversationGateway) {}


	@UseGuards(Jwt_Auth_Guard)
	@Post('create_group_chat/create')
	async createConversation(
		@Req()
		req : any,
		@Body() bodyContent : {chat_name: string, password: string, askPassword?: boolean })
		{
			if (typeof bodyContent.chat_name === "undefined")
			{
				console.log("not creating chat because of undefined chat_name");
				return null;
			}
			let array : number[] = [];
			let user : User;
			let pwd : string;
			console.log(`The chatName is: ${bodyContent.chat_name}`);
			console.log(`The password is: ${bodyContent.password}`);
			console.log(`The boolean is: ${bodyContent.askPassword}`);
			
			if(bodyContent.password.length != 0) {
				pwd = hashPassword(bodyContent.password);
			}
			// for (let i = 0; i < bodyContent.chat_name.length; ++i)
			// {
			// 	let chat_member = this.conversationsService.findConversationByName(bodyContent.chat_name);
			// 	user = await this.userService.findUserById(req.user.id);
			// 	if(user)
			// }
			array.push(req.user.id);

			console.log("CHAT_NAME = " + bodyContent.chat_name);
			let newConversation : Conversation = await this.conversationsService.createConversation({
				conversation_name: bodyContent.chat_name,
				conversation_participant_arr: [Number(req.user.id)],
				conversation_owner_arr: [Number(req.user.id)],
				conversation_admin_arr: [Number(req.user.id)],
				group_chat: true,
				conversation_password: pwd,
				ask_password: bodyContent.password.length != 0
			})

			for (let i = 0; i < array.length; ++i)
			{
				user = await this.userService.findUserById(array[i]);
				console.log("CONVERSATION_ID_ARR = " + user.conversation_id_arr);
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
			const ret = await this.conversationsService.name_fix(newConversation, req.user.id);
			return ret;
		}

		@UseGuards(Jwt_Auth_Guard)
		@Post('join_group_chat/join')
		async joinConversation(
			@Req() req: any,	
			@Body() body : {chat_id: number, password: string}
		) {
			console.log("CHAT_ID " + body.chat_id);
			console.log("Password " + body.password);
			const existingConversation = await this.conversationsService.findConversation(body.chat_id)
			if (!existingConversation.group_chat) {
				console.log("The conversation is not a group chat!");
				return null;
			}
			//the condition here was incorrect, Krisi changed it, doublecheck if I missed something
			if (existingConversation.ask_password == true && !comparePassword(body.password, existingConversation.conversation_password)) {
				
				console.log("wrong password");
				return (false);
			} 
			const userIdx = existingConversation.conversation_participant_arr.indexOf(req.user.id);		//is he already part of the chat
			if (userIdx > -1) return (false);			// this means he is already part of the chat and i dont want to add him again
			await this.conversationsService.updateConversation({
				where: {
					conversation_id: Number(body.chat_id)
				},
				data: {
					conversation_participant_arr: {
						push: Number(req.user.id)
					}
				}
			})
			this.conversationsService.updateConversationIdInUser(req.user.id, body.chat_id);
			this.convGateway.joined_chat(Number(body.chat_id), Number(req.user.id));

		console.log("admin_array2 = " + existingConversation.conversation_admin_arr);
		console.log("owner_array2 = " + existingConversation.conversation_owner_arr);
		console.log("participant_array2 = " + existingConversation.conversation_participant_arr);			
			return (true);
		}

		@UseGuards(Jwt_Auth_Guard)
		@Post('change_password/')
		async change_password(
			@Req() req: any,
			@Body() body: {chat_id, password: string}
			) {
				const existingConversation = await this.conversationsService.findConversation(body.chat_id);
				let pwd = body.password;
				if (body.password.length != 0) {
					pwd = hashPassword(pwd);
					const updatedConversation = this.conversationsService.updateConversation({
						where: {
							conversation_id: Number(body.chat_id),
						},
						data: {
							conversation_password: pwd,
							
						}
						
					})
					return updatedConversation;
				}
				else {
					return this.conversationsService.updateConversation({
						where: {
							conversation_id: Number(body.chat_id),
						},
						data: {
							conversation_password: pwd,
							ask_password: false
						}
					})
				}
			}
		@UseGuards(Jwt_Auth_Guard) 
		@Get('remove_password/:chat_id')
		async remove_password(
			@Req() req: any,
			@Param('chat_id') chat_id: number
			) {
				const existingConversation = await this.conversationsService.findConversation(chat_id);
			
				if (existingConversation.conversation_password.length != 0) {
					// pwd = hashPassword(pwd);
					return this.conversationsService.updateConversation({
						where: {
							conversation_id: Number(chat_id),
						},
						data: {
							conversation_password: existingConversation.conversation_password,
							ask_password: false
						}
					})
				}
			}

		@UseGuards(Jwt_Auth_Guard)
		@Post('set_password/:chat_id')
		async set_password(@Req() req: any, @Param('chat_id') chat_id: number, @Body('Password') password : string)
		{
			// console.log("this is password in controller " + JSON.stringify( password));
			// console.log("this is password in controller " + password);

			await this.conversationsService.set_password(Number(chat_id), Number(req.user.id), password);
		}

		@UseGuards(Jwt_Auth_Guard)
		@Get('join_dialogue/:other_user_id')
		async joinDialogue(
			@Req() req: any,
			@Param('other_user_id') anotherUserId: string
			) {
				const check = await this.conversationsService.findDialogue(Number(req.user.id), Number(anotherUserId));
				if (check)
					return check;
				const arr: number[] = [Number(anotherUserId), Number(req.user.id)];
				
				const new_dialogue = await this.conversationsService.createConversation({
					conversation_participant_arr: arr,
				})
				console.log("NEW_DIALOGUE + " + new_dialogue.conversation_id);
 
				this.conversationsService.updateConversationIdInUser(Number(anotherUserId), new_dialogue.conversation_id);
				this.conversationsService.updateConversationIdInUser(Number(req.user.id), new_dialogue.conversation_id);
				// this.conversationsService.name_fix(new_dialogue, req.user.id);
				const ret = await this.conversationsService.name_fix(new_dialogue, req.user.id);
				return ret;
				// let conversation: Conversation;
				// conversation.conversation_participant_arr.push(req.user.id);
				// console.log("after push " + conversation.conversation_participant_arr);
				 
				
				// if (!existingConversation) return null;
				// const userIdx = existingConversation.conversation_participant_arr.indexOf(req.user.id);		//is he already part of the chat
				// if (userIdx > 0) return null;				// this means he is already part of the chat and i dont want to add him again
				// await this.conversationsService.updateConversation({
				// 	where: {
				// 		conversation_id: Number(userContent.conversation_id_arr)
				// 	},
				// 	data: {
				// 		conversation_participant_arr: {
				// 			push: Number(req.user.id)
				// 		}
				// 	}
				// }) 
				// const updatedUser = await this.userService.updateUser({
				// 	where: {
				// 		id : Number(req.user.id)
				// 	},
				// 	data: {         
				// 		conversation_id_arr: {
				// 			push: Number(userContent.conversation_id_arr)
				// 		}
				// 	}
				// })
				// return updatedUser
			
			
			// const currUser = await this.userService.findUserById();
			// console.log("convParticipant: " + convParticipant);
			
			// let existingConversation: Conversation;
			// console.log(existingConversation.conversation_id);
			
			// existingConversation = await this.conversationsService.findConversation(existingConversation.conversation_id);
			// console.log("existingChatID " + existingConversation.conversation_id);
			
			// console.log("existingChatID " + existingConversation.conversation_id);
			
			// if (!existingConversation) return null;
			// // const arr = new Array<number>(2);
			// existingConversation.conversation_participant_arr.push(req.user.id);
			// existingConversation.conversation_participant_arr.push(anotherUserId);
			// if (existingConversation.conversation_participant_arr.length > 2)
			// 	throw new Error("Dialogue cannot have more than 2 users!");
			
		}

		@UseGuards(Jwt_Auth_Guard)
		@Get('getMyChats')
		async getMyConversations(
			@Req() req: any,
		) {
			console.log();
			return this.conversationsService.findAllConversationsByUser(req.user.id);
		}

		@UseGuards(Jwt_Auth_Guard)
    	@Get('/get_messages_from_conversation/:conversationID')
    	getMsgsFromConversation(@AuthUser() user: User, @Param('conversationID') conversationId: number, @Req() _req: any)
		{
    	    return this.conversationsService.getMsgsByConversationID(conversationId, _req.user.id);
		}

		@UseGuards(Jwt_Auth_Guard)
		@Get('getConversationNameById/:conversation_id')
		async getConversationName(
			@Param('conversation_id') conversation_id
		) {
			console.log("getconversation name "+ JSON.stringify(conversation_id));
			const conv = await this.conversationsService.findConversation(conversation_id);
			if(conv)
			{
				console.log("i will be returning this "+ conv.conversation_name);
				return (conv.conversation_name);
			}
			else
				return ("");
		}

		@UseGuards(Jwt_Auth_Guard)
		@Get('getConversationById/:conversation_id')
		async getConversation(
			@Req() req: any,
			@Param('conversation_id') conversation_id
		) {
			console.log();
			const conv = await this.conversationsService.findConversation(conversation_id);
			return this.conversationsService.name_fix(conv, req.user.id);
		}

		@UseGuards(Jwt_Auth_Guard)
		@Get('getConversations')
		async getConversations(): Promise<Conversation[]> {
			

			return this.conversationsService.getConversations({});
		}

		@UseGuards(Jwt_Auth_Guard)
		@Get('getAllChatsWithoutUser')
		async getConversationsWithoutCurrUser(
			@Req() req: any,
		) {
			return this.conversationsService.getChatsUserNotPartOf(req.user.id);
		}

		//update an existing resource
		@UseGuards(Jwt_Auth_Guard)
		@Put(':conversationId/setAdmin/:adminId')
		async setAdmin(
			@Req() req: any,
			@Param('conversationId', new ParseIntPipe()) conversId: number,
			@Param('adminId', new ParseIntPipe()) admId: number
		) : Promise<Conversation> {
			console.log("ADMIN_ID = " + admId);
			console.log("User_ID = " + req.user.id);

			return this.conversationsService.setAdministratorOfConversation(conversId, admId, req.user.id);
		}


		@UseGuards(Jwt_Auth_Guard)
		@Put('leave/:conversation_id')
		async leaveConversation(
			@Req() req: any,
			@Param('conversation_id') conversation_id: number
		): Promise<Conversation> {
			return this.conversationsService.leave_conversation(conversation_id, req)
		}

		@UseGuards(Jwt_Auth_Guard)
		@Put(':conversation_id/setMute/:id_to_mute')
		async setMuteUser(
			@Req() req: any,
			@Param('conversation_id', new ParseIntPipe()) conversation_id: number,
			@Param('id_to_mute', new ParseIntPipe()) id_to_mute: number
		): Promise<Conversation> {
			const conversation : Conversation = await this.conversationsService.findConversation(Number(conversation_id));

			const admin_user_idx = conversation.conversation_admin_arr.indexOf(req.user.id, 0);
			const idx_from_mute_list = conversation.conversation_mute_list_arr.findIndex(element => element == Number(id_to_mute));
			const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == Number(id_to_mute));

			if (owner_user_idx >= 0)
				throw new HttpException("Can't mute the conversation owner!!!", HttpStatus.FORBIDDEN);
			else if (admin_user_idx < 0) {
				console.log("Current user is not considered to be an Administrator");
				return conversation;
			} 
			else if (idx_from_mute_list >= 0) {
				conversation.conversation_mute_list_arr.splice(idx_from_mute_list, 0);
				const updatedConversationWithMuteUser = await this.conversationsService.updateConversation({
					where: {
						conversation_id: Number(conversation_id),
					},
					data: {
						conversation_mute_list_arr: conversation.conversation_mute_list_arr
					}
				})
				return updatedConversationWithMuteUser;
			}
			else {
				const updatedConversationWithoutMuteUser = await this.conversationsService.updateConversation({
					where: {
						conversation_id: Number(conversation_id),
					},
					data: {
						conversation_mute_list_arr: {
							push: Number(id_to_mute),
						}
					}
				})
				return updatedConversationWithoutMuteUser;
			}
		}

		@UseGuards(Jwt_Auth_Guard)
		@Put(':conversation_id/setBan/:id_to_ban')
		async setBanUser(
			@Req() req: any,
			@Param('conversation_id', new ParseIntPipe()) conversation_id: number,
			@Param('id_to_ban', new ParseIntPipe()) id_to_ban: number,
		) {
			const conversation = await this.conversationsService.findConversation(conversation_id);
			console.log("CONVERSATION_ID = " + conversation.conversation_id);

			const admin_user_idx = conversation.conversation_admin_arr.indexOf(req.user.id, 0);
			const idx_from_black_list = conversation.conversation_black_list_arr.findIndex(element => element == id_to_ban);
			const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == id_to_ban);
			console.log("ADMIN_USER_IDX = " + admin_user_idx);
			console.log("idx_from_black_list = " + idx_from_black_list);
			console.log("owner_user_idx = " + owner_user_idx);

			if (owner_user_idx >= 0) {
				console.log("HEREEEE1");
				throw new HttpException("Can't mute the conversation owner!!!", HttpStatus.FORBIDDEN);
			}
			else if (admin_user_idx < 0) {
				console.log("HEREEEE2");
				console.log("Current user is not considered to be an Administrator");
				return conversation;
			}
			else if (idx_from_black_list >= 0) {
				console.log("HEREEEE3");
				
				conversation.conversation_black_list_arr.splice(idx_from_black_list, 1);
				return this.conversationsService.updateConversation({
					where: {
						conversation_id: Number(conversation_id),
					},
					data: {
						conversation_black_list_arr: conversation.conversation_black_list_arr,
					}
				})
			}
			else {
				const black_list_idx = conversation.conversation_participant_arr.indexOf(id_to_ban);
				console.log("black_list_idx" + black_list_idx);
				
				conversation.conversation_black_list_arr.splice(black_list_idx, 1);
				const user : User = await this.userService.findUserById(id_to_ban);

				const convers_idx_arr_from_user = user.conversation_id_arr.indexOf(conversation_id);
				user.conversation_id_arr.splice(convers_idx_arr_from_user, 1);
				this.userService.updateUser({
					where: {
						id: Number(id_to_ban)
					},
					data: {
						conversation_id_arr: user.conversation_id_arr
					}
				})
				const updatedConversationWithoutBannedUser = await this.conversationsService.updateConversation({
					where: {
						conversation_id: Number(conversation_id)
					},
					data: {
						conversation_black_list_arr: {
							push: Number(id_to_ban),
						}
					}
				})
				return updatedConversationWithoutBannedUser;
			}	
		}

		@UseGuards(Jwt_Auth_Guard)
		@Put(':conversation_id/setKick/:id_to_kick')
		async setKickUser(
			@Req() req: any,
			@Param('conversation_id', new ParseIntPipe()) conversation_id: number,
			@Param('id_to_kick', new ParseIntPipe()) id_to_kick: number,
		) {
			return this.conversationsService.remove_user_from_conversation(conversation_id, req.user.id, id_to_kick);
		}

		@Get('is_password_protected/:conv_id')
		@UseGuards(Jwt_Auth_Guard)
		@UseGuards(Two_FA_Guard)
		async	is_password_protected(@Param('conv_id', new ParseIntPipe()) conv_id: number)
		{
			return (this.conversationsService.is_pass_protected(conv_id));
		}



}

// async banUser(@Req() req : any, @Param('id', new ParseIntPipe()) id: number, @Param('bid', new ParseIntPipe()) bid: number){
//     const chat : Chat = await this.chatService.findOne(id);
//     const index = chat.admins.indexOf(req.user.id, 0);
//     const index1 = chat.blackList.findIndex(x => x == bid)
//     const index2 = chat.owner.findIndex(x => x == bid)
//     if (index == -1){
//       console.log("User not admin");
//       return chat;
//     }
//     else if (index2 > -1) {
//       throw new HttpException('Trying to ban Owner', HttpStatus.FORBIDDEN);
//     }
//     else if (index1 > -1) {
//       chat.blackList.splice(index1, 1);
//       return this.chatService.updateChat({
//         where: { id: Number(id) },
//         data: {
//           blackList: chat.blackList
//         },
//       });
//     }
//     else{
//       const index1 = chat.participants.indexOf(bid);
//       console.log(index1);
//       chat.participants.splice(index1, 1);
//       const user : User = await this.userService.findOne(bid);
//       const index2 = user.chatId.indexOf(id);
//       user.chatId.splice(index2, 1);
//       this.userService.updateUser({
//         where: {id: Number(bid)},
//         data: {chatId: user.chatId},
//       })
//       // console.log(participants);
//       return this.chatService.updateChat({
//         where: { id: Number(id) },
//         data: {
//           participants: chat.participants,
//           blackList: {
//             push: Number(bid)
//           }
//         },
//       });
//     }
//   }
// }



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