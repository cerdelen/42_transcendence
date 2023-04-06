import { Inject, HttpException, HttpStatus, Injectable, createParamDecorator } from '@nestjs/common';
import { Conversation, User, PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';


import { Message } from "@prisma/client"

@Injectable()
export class ConversationService {
	constructor(
		private prisma: PrismaService,
		private user: UserService
	) { }

	async createConversation(data: Prisma.ConversationCreateInput): Promise<Conversation> {
		const newConversation = await this.prisma.conversation.create({
			data,
		})
		return newConversation;
	}

	async findDialogue(user_id1: number, user_id2: number) {
		const checkDialogue = await this.prisma.conversation.findMany({

			where: {
				group_chat: false,
				conversation_participant_arr: {
					has: user_id1,
				}
			}
		})
		for (let i = 0; i < checkDialogue.length; i++) {
			if (checkDialogue[i].conversation_participant_arr.includes(user_id2)) {
				return checkDialogue[i];
			}
		}

	}

	async is_pass_protected(conv_id: number) {
		const conv = await this.prisma.conversation.findUnique({ where: { conversation_id: conv_id } });

		if (!conv)
			return false;
		return conv.ask_password;
	}

	async set_password(chat_id: number, user_id: number, password: string) {

		const conv = await this.prisma.conversation.findUnique({ where: { conversation_id: chat_id } });

		if (!conv)
			return;
		if (conv.group_chat == false)
			return;
		if (conv.conversation_owner_arr[0] != user_id)
			return;
		await this.prisma.conversation.update({
			where: {
				conversation_id: chat_id
			},
			data: {
				conversation_password: password,
				ask_password: true,
			}
		})
	}

	async updateConversation(
		params: {
			where: Prisma.ConversationWhereUniqueInput;
			data: Prisma.ConversationUpdateInput;
		}):
		Promise<Conversation> {
		const { where, data } = params;
		return this.prisma.conversation.update({
			data,
			where,
		})
	}

	async name_fix(conv: Conversation, user_id: number) {
		if (!conv)
			return;
		if (conv.group_chat == false) {
			const id_1 = conv.conversation_participant_arr[0];
			const id_2 = conv.conversation_participant_arr[1];
			const user_1 = await this.prisma.user.findUnique({ where: { id: id_1 } })
			const user_2 = await this.prisma.user.findUnique({ where: { id: id_2 } })
			if (user_1 && user_2) {
				if (user_id == user_1.id)
					conv.conversation_name = user_2.name;
				else
					conv.conversation_name = user_1.name;
			}
			else
				conv.conversation_name = "";
		}
		return conv;
	}

	async conversation(conversationwhereuniqueinput: Prisma.ConversationWhereUniqueInput) {
		return this.prisma.conversation.findUnique({
			where: conversationwhereuniqueinput
		})
	}

	async findConversation(id: number): Promise<Conversation | undefined> {
		if (Number.isNaN(Number(id)))
			return null;
		const foundConversation = await this.conversation({ conversation_id: Number(id) });
		return foundConversation;
	}

	async findAllConversationsByUser(user_id: number) {
		const existingUser = this.prisma.user.findUnique({
			where: {
				id: user_id,
			}
		})
		if (existingUser)
			return (await existingUser).conversation_id_arr;
		else
			return [];
	}


	async getConversations(params: {
		where?: Prisma.ConversationWhereInput;
	}): Promise<Conversation[]> {
		const { where } = params;
		return this.prisma.conversation.findMany({
			where,
		},
		)
	}

	async exclude(user, ...keys) {
		for (let id of keys) {
			delete user[id];
		}
		return user;
	}

	async getChatsUserNotPartOf(user_id: number): Promise<number[]> {
		const convs = await this.prisma.conversation.findMany({
			where: {
				NOT: {
					conversation_participant_arr: {
						has: user_id,
					},

				},


			}

		})
		let arr: number[] = [];
		for (let i: number = 0; i < convs.length; i++) {
			if (convs[i].group_chat == true)
				arr.push(convs[i].conversation_id);
		}
		return arr;
	}

	async getMsgsByConversationID(conversationId: number, user_id: number): Promise<Message[]> {

		const user = await this.prisma.user.findUnique({ where: { id: user_id } });
		let Msg: Message[] = await this.prisma.message.findMany({
			where: {
				conversation_id: Number(conversationId),

			},
			orderBy: {
				created_at: 'desc'
			},
		})

		for (let i = 0; i < user.blocked_users.length; i++) {
			for (let index = 0; index < Msg.length; index++) {
				if (user.blocked_users.includes(Msg[index].author)) {
					Msg.splice(index, 1)
					index--;
				}
			}
		}

		return Msg;
	}


	async setAdministratorOfConversation(conversId: number, adminId: number, userId: number): Promise<Conversation> {
		let conversation: Conversation;


		conversation = await this.findConversation(conversId);


		const index_of_user = conversation.conversation_admin_arr.findIndex(element => element === userId);
		const index_of_admin = conversation.conversation_admin_arr.findIndex(element => element === adminId);

		if (index_of_user == -1) {
			return conversation;

		}

		else if (index_of_admin > -1) {
			conversation.conversation_admin_arr.splice(index_of_admin, 0);
			const update_conversation_admin_arr = this.updateConversation({
				where: {
					conversation_id: Number(conversId),
				},
				data: {
					conversation_admin_arr: conversation.conversation_admin_arr
				}
			})
			return update_conversation_admin_arr;
		}
		else {
			return this.updateConversation({
				where: {
					conversation_id: Number(conversId)
				},
				data: {
					conversation_admin_arr: {
						push: Number(adminId)
					}
				}
			})
		}
	}

	async leave_conversation(conversation_id: number, user_id: number): Promise<number> {
		const enum Status {
			NO_CHAT,
			NO_CHANGE,
			NEW_OWNER_AND_ADMIN,
			NEW_OWNER,
			NEW_ADMIN,
			LEFT_CHAT,
		}
		let new_owner: boolean = false;
		let new_admin: boolean = false;
		const conversation: Conversation = await this.findConversation(conversation_id);
		if (!conversation)
			return Status.NO_CHAT;
		if ((conversation.group_chat == false ) || (!conversation.conversation_participant_arr.includes(user_id)))
			return Status.NO_CHANGE;
		const req_user_idx = conversation.conversation_participant_arr.indexOf(user_id, 0);
		const user: User = await this.user.findUserById(user_id);
		const conversation_id_arr_from_user = user.conversation_id_arr.indexOf(conversation_id);
		const user_admin_idx = conversation.conversation_admin_arr.indexOf(user_id);
		const user_owner_idx = conversation.conversation_owner_arr.indexOf(user_id);
		conversation.conversation_participant_arr.splice(req_user_idx, 1);
		if (conversation.conversation_participant_arr.length == 0) {
			await this.delete_conversation(conversation_id);
			return Status.NO_CHAT;
		}
		if (user_admin_idx >= 0) {
			conversation.conversation_admin_arr.splice(user_admin_idx, 1);
			if (conversation.conversation_admin_arr.length == 0) {
				if (conversation.conversation_participant_arr.length > 0) {
					new_admin = true;
					conversation.conversation_admin_arr.push(conversation.conversation_participant_arr[0]);
				}
			}
		}
		if (user_owner_idx > -1) {
			conversation.conversation_owner_arr.splice(user_owner_idx, 1);
			if (conversation.conversation_participant_arr.length > 0)
			{
				console.log("updating owner array");
				conversation.conversation_owner_arr.push(conversation.conversation_participant_arr[0]);
				new_owner = true;
			}
		}
		user.conversation_id_arr.splice(conversation_id_arr_from_user, 1);
		console.log("this is here");
		
		await this.updateConversation({
			where: {
				conversation_id: Number(conversation_id),
			},
			data: {
				conversation_participant_arr: conversation.conversation_participant_arr,
				conversation_admin_arr: conversation.conversation_admin_arr,
				conversation_owner_arr: conversation.conversation_owner_arr
			}
		})
		await this.user.updateUser({
			where: {
				id: Number(user_id)
			},
			data: {
				conversation_id_arr: user.conversation_id_arr,
			}
		})
		
		if (new_admin && new_owner) {
			return Status.NEW_OWNER_AND_ADMIN;
		} else if (new_owner) {
			return Status.NEW_OWNER;
		} else if (new_admin) {
			return Status.NEW_ADMIN;
		} else {
			return Status.LEFT_CHAT;
		}

	}

	async delete_conversation(chat_id: number) {
		const conversation: Conversation = await this.prisma.conversation.findUnique({ where: { conversation_id: chat_id } });
		if (!conversation)
			return;
		return this.prisma.conversation.delete({ where: { conversation_id: chat_id } });
	}

	async updateConversationIdInUser(user_id: number, conversationId: number): Promise<User> {


		const conversation = await this.findConversation(conversationId);


		const updatedUser = this.user.updateUser({
			where: {
				id: user_id
			},
			data: {
				conversation_id_arr: {
					push: conversation.conversation_id
				}
			}
		})
		return updatedUser;
	}

	async remove_user_from_conversation(chat_id: number, userId: number, id_to_kick: number) {

		const conversation = await this.prisma.conversation.findUnique({
			where: {
				conversation_id: chat_id,
			}
		})
		if (!conversation) return;
		const admin_user_idx = conversation.conversation_admin_arr.indexOf(userId, 0);
		const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == id_to_kick);
		if (owner_user_idx >= 0) {
			throw new HttpException("Can't kick the conversation owner!!!", HttpStatus.FORBIDDEN);
		}
		else if (admin_user_idx < 0) {
			return conversation;
		}
		const req_user_idx = conversation.conversation_participant_arr.indexOf(id_to_kick);
		conversation.conversation_participant_arr.splice(req_user_idx, 1);
		await this.prisma.conversation.update({
			where: { conversation_id: chat_id },
			data: { conversation_participant_arr: conversation.conversation_participant_arr }
		});
		const user = await this.prisma.user.findUnique({ where: { id: id_to_kick } });
		const conv_id_from_user = user.conversation_id_arr.indexOf(chat_id);
		user.conversation_id_arr.splice(conv_id_from_user, 1);
		await this.prisma.user.update({
			where: { id: id_to_kick },
			data: { conversation_id_arr: user.conversation_id_arr }
		});
	}
}

