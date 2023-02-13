import { Body, Controller, ParseIntPipe, Post, Res } from '@nestjs/common';
import { TwoFaService } from './two_fa.service';

@Controller('2-fa')
export class TwoFaController {
	constructor(
		private two_FA_Service: TwoFaService,
	) {}

	@Post('verifyCode')
	verifyCode(@Body('userid', ParseIntPipe) userid: number, @Body('code') code:string, @Res({passthrough: true}) res: any) : Promise <any>
	{
		return this.two_FA_Service.verifyCode(userid, code, res);
	}
}
