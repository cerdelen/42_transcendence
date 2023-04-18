import { UseGuards, Post, Inject, Body, UsePipes, ValidationPipe, Req, Get, Controller, Param, Put, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AuthUser } from 'src/utils/decorators';
import { User, Conversation, Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
import { Jwt_Auth_Guard } from '../auth/guards/jwt_auth.guard';
import { ConversationService } from './conversations.service';
import { conversationGateway } from './conversationSocket/conversation.gateway';
import { Two_FA_Guard } from 'src/two_fa/guard/two_fa.guard';
import { hashPassword } from 'src/utils/hash_passwrd';
import { comparePassword } from '../utils/hash_passwrd';


@Controller('conversation')
export class ConversationController {
	constructor(
		private readonly conversationsService: ConversationService,
		private readonly userService: UserService,
		private readonly convGateway: conversationGateway
	) { }


	@UseGuards(Jwt_Auth_Guard)
	@Post('create_group_chat/create')
	async createConversation(
		@Req()
		req: any,
		@Body() bodyContent: { chat_name: string, password: string, askPassword?: boolean }) {
		if (typeof bodyContent.chat_name === "undefined") {
			return null;
		}
		let array: number[] = [];
		let user: User;
		let pwd: string;
		if (bodyContent.password.length != 0) {
			pwd = hashPassword(bodyContent.password);
		}
		array.push(req.user.id);
		let newConversation: Conversation = await this.conversationsService.createConversation({
			conversation_name: bodyContent.chat_name,
			conversation_participant_arr: [Number(req.user.id)],
			conversation_owner_arr: [Number(req.user.id)],
			conversation_admin_arr: [Number(req.user.id)],
			group_chat: true,
			conversation_password: pwd,
			ask_password: bodyContent.password.length != 0
		})

		for (let i = 0; i < array.length; ++i) {
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
		const ret = await this.conversationsService.name_fix(newConversation, req.user.id);
		this.convGateway.created_chat(newConversation.conversation_id, req.user.id);
		return ret;
	}

	@UseGuards(Jwt_Auth_Guard)
	@Post('join_group_chat/join')
	async joinConversation(
		@Req() req: any,
		@Body() body: { chat_id: number, password: string }
	) {
		const existingConversation = await this.conversationsService.findConversation(body.chat_id)
		if (!existingConversation.group_chat) {
			return null;
		}
		if(existingConversation.conversation_black_list_arr.includes(req.user.id))
			throw new HttpException("Can't join chat because you are banned!!!", HttpStatus.FORBIDDEN);
		if (existingConversation.ask_password == true && !comparePassword(body.password, existingConversation.conversation_password)) {

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
		return (true);
	}

	@UseGuards(Jwt_Auth_Guard)
	@Post('change_password/:chat_id')
	async change_password(
		@Param('chat_id') chat_id: number,
		@Body() body: { password: string }
	) {
		const existingConversation = await this.conversationsService.findConversation(chat_id);
		let pwd = body.password;
		if (body.password.length != 0) {
			pwd = hashPassword(pwd);
			const updatedConversation = this.conversationsService.updateConversation({
				where: {
					conversation_id: Number(chat_id),
				},
				data: {
					conversation_password: pwd,
					ask_password: true
				}
			})
			return updatedConversation;
		}
		else {
			return this.conversationsService.updateConversation({
				where: {
					conversation_id: Number(chat_id),
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
		if (!existingConversation)
			return null;
		if (!existingConversation.conversation_password)
			return existingConversation;
		if (existingConversation.conversation_password.length != 0) {
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
	async set_password(@Req() req: any, @Param('chat_id') chat_id: number, @Body('Password') password: string) {
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
		this.conversationsService.updateConversationIdInUser(Number(anotherUserId), new_dialogue.conversation_id);
		this.conversationsService.updateConversationIdInUser(Number(req.user.id), new_dialogue.conversation_id);
		const ret = await this.conversationsService.name_fix(new_dialogue, req.user.id);
		return ret;
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('getMyChats')
	async getMyConversations(
		@Req() req: any,
	) {
		return this.conversationsService.findAllConversationsByUser(req.user.id);
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('/get_messages_from_conversation/:conversationID')
	getMsgsFromConversation(@AuthUser() user: User, @Param('conversationID') conversationId: number, @Req() _req: any) {
		return this.conversationsService.getMsgsByConversationID(conversationId, _req.user.id);
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('getConversationNameById/:conversation_id')
	async getConversationName(
		@Param('conversation_id') conversation_id
	) {
		const conv = await this.conversationsService.findConversation(conversation_id);
		if (conv) {
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
	) {
		const conv = await this.conversationsService.setAdministratorOfConversation(conversId, admId, req.user.id);
		if (conv) {
			if (conv.conversation_admin_arr.includes(admId)) {
				this.convGateway.new_admin_has_been_set(conv.conversation_id, admId);
			}
		}
	}

	@UseGuards(Jwt_Auth_Guard)
	@Put(':conversation_id/setMute/:id_to_mute')
	async setMuteUser(
		@Req() req: any,
		@Param('conversation_id', new ParseIntPipe()) conversation_id: number,
		@Param('id_to_mute', new ParseIntPipe()) id_to_mute: number
	){
		const conversation: Conversation = await this.conversationsService.findConversation(Number(conversation_id));

		const admin_user_idx = conversation.conversation_admin_arr.indexOf(req.user.id, 0);
		const idx_from_mute_list = conversation.conversation_mute_list_arr.findIndex(element => element == Number(id_to_mute));
		const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == Number(id_to_mute));

		if (owner_user_idx >= 0)					
			throw new HttpException("Can't mute the conversation owner!!!", HttpStatus.FORBIDDEN);
		else if (admin_user_idx < 0) { //Current user is not considered to be an Administrator
			return ;
		}
		else if (idx_from_mute_list >= 0)
		{
			return ;
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
			this.convGateway.mute_user(Number(conversation_id), Number(id_to_mute));
			await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5));
			const ret : boolean = await this.conversationsService.unmute_user_from_conversation(conversation_id, req.user.id, id_to_mute, false);
			if (ret)
				this.convGateway.unmute_user(Number(conversation_id), Number(id_to_mute));
			return ;
		}
	}

	@UseGuards(Jwt_Auth_Guard)
	@Put(':conversation_id/setUnMute/:id_to_mute')
	async setUnMuteUser(
		@Req() req: any,
		@Param('conversation_id', new ParseIntPipe()) conversation_id: number,
		@Param('id_to_mute', new ParseIntPipe()) id_to_unmute: number
	){
		// const conversation: Conversation = await this.conversationsService.findConversation(Number(conversation_id));

		// const admin_user_idx = conversation.conversation_admin_arr.indexOf(req.user.id, 0);
		// const idx_from_mute_list = conversation.conversation_mute_list_arr.findIndex(element => element == Number(id_to_unmute));
		// const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == Number(id_to_unmute));

		// // if (owner_user_idx >= 0)					
		// // 	throw new HttpException("Can't mute the conversation owner!!!", HttpStatus.FORBIDDEN);
		// if (admin_user_idx < 0) { //Current user is not considered to be an Administrator
		// 	return ;
		// }
		// else if (idx_from_mute_list == -1)
		// {
		// 	return ;
		// }
		// else {
		// 	conversation.conversation_mute_list_arr.splice(idx_from_mute_list, 1);
		// 	const updatedConversation = await this.conversationsService.updateConversation({
		// 		where: {
		// 			conversation_id: Number(conversation_id)
		// 		},
		// 		data: {
		// 			conversation_mute_list_arr: conversation.conversation_mute_list_arr,
		// 		}
		// 	})
		// 	// const updatedConversationWithoutMuteUser = await this.conversationsService.updateConversation({
		// 	// 	where: {
		// 	// 		conversation_id: Number(conversation_id),
		// 	// 	},
		// 	// 	data: {
		// 	// 		conversation_mute_list_arr: {
		// 	// 			push: Number(id_to_mute),
		// 	// 		}
		// 	// 	}
		// 	// })
			const unmuted_from_chat = await this.conversationsService.unmute_user_from_conversation(conversation_id, req.user.id, id_to_unmute);
			if (unmuted_from_chat)
				this.convGateway.unmute_user(Number(conversation_id), Number(id_to_unmute));
			
			return ;
		
	}

	@UseGuards(Jwt_Auth_Guard)
	@Put(':conversation_id/setBan/:id_to_ban')
	async setBanUser(
		@Req() req: any,
		@Param('conversation_id', new ParseIntPipe()) conversation_id: number,
		@Param('id_to_ban', new ParseIntPipe()) id_to_ban: number,
	) {
		const conversation = await this.conversationsService.findConversation(conversation_id);
		const admin_user_idx = conversation.conversation_admin_arr.indexOf(req.user.id, 0);
		const idx_from_black_list = conversation.conversation_black_list_arr.findIndex(element => element == id_to_ban);
		const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == id_to_ban);
		if (owner_user_idx >= 0) {
			// console.log("in if");
			throw new HttpException("Can't mute the conversation owner!!!", HttpStatus.FORBIDDEN);
		}
		else if (admin_user_idx < 0) {
			// console.log("else if 1");
			return conversation;
		}
		else if (idx_from_black_list >= 0) {
			// console.log("else if 2");
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
			// console.log("last else");

			const idx_in_participant_arr = conversation.conversation_participant_arr.indexOf(id_to_ban);
			conversation.conversation_participant_arr.splice(idx_in_participant_arr, 1);
			const user: User = await this.userService.findUserById(id_to_ban);

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
					},
					conversation_participant_arr : conversation.conversation_participant_arr
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
		const conv_bef = await this.conversationsService.findConversation(conversation_id);
		if(!conv_bef.conversation_participant_arr.includes(id_to_kick))
		return conv_bef;
		// console.log("before ", conv_bef.conversation_participant_arr);
		const conv = await this.conversationsService.remove_user_from_conversation(conversation_id, req.user.id, id_to_kick);
		// console.log("after ", conv.conversation_participant_arr);
		if(!conv.conversation_participant_arr.includes(id_to_kick))
			this.convGateway.left_chat(conversation_id, id_to_kick);
		return conv;
	}

	@Get('is_password_protected/:conv_id')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async is_password_protected(@Param('conv_id', new ParseIntPipe()) conv_id: number) {
		return (this.conversationsService.is_pass_protected(conv_id));
	}
}