import { Controller, Body, Post, Req, UseGuards, Get, Param } from "@nestjs/common";
import { AuthUser } from "src/utils/decorators";
import { CreateMsgDto } from "./CreateMsg.dto";
import { User } from "@prisma/client";
import { MsgService } from "./msg.service";
import { Jwt_Auth_Guard } from "src/auth/guards/jwt_auth.guard";
// import { JwtPayload } from '../../dist/two_fa/strategy/two_fa.strategy';

import { EventEmitter2 } from "@nestjs/event-emitter";




@Controller('msg')
export class MsgController {
	constructor( 
		private readonly msgService: MsgService, 
		private eventEmitter: EventEmitter2,
	){} 

	@UseGuards(Jwt_Auth_Guard)
	@Post()
	async createMessage(
		@Req() req: any,
		@Body() createMsgDto: CreateMsgDto,
	) {		
		const msg = await this.msgService.createMsg(createMsgDto)
		this.eventEmitter.emit('create.message', msg)
		return;
	}

	// @UseGuard            s(Jwt_Auth_Guard)
	// @Get(':conversationID')
	// getMsgsFromConversation(
	// 	@AuthUser() user: User,
	// 	@Param('conversationID') conversationId: number,
	// ) {
	// 	return this.msgService.getMsgsByConversationID(conversationId)
	// }

	@Get(':userid') 
	getMsgsFromUser(
		@AuthUser() user: User,
		@Param('userid') user_id: number, 
	) {		
		return this.msgService.getMsgByUser(user_id)
	}
}
