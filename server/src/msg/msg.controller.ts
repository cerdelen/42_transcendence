import { Controller, Body, Post, Req, UseGuards, Get, Param } from "@nestjs/common";
import { AuthUser } from "src/utils/decorators";
import { CreateMsgDto } from "./CreateMsg.dto";
import { User } from "@prisma/client";
import { MsgService } from "./msg.service";
import { Jwt_Auth_Guard } from "src/auth/guards/jwt_auth.guard";



@Controller('msg')
export class MsgController {
	constructor( 
		private readonly msgService: MsgService, 
	){} 

	@UseGuards(Jwt_Auth_Guard)
	@Post()
	createMessage(
		@Req() req: any,
		@Body() createMsgDto: CreateMsgDto,
	) {		
		return this.msgService.createMsg(createMsgDto)
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
