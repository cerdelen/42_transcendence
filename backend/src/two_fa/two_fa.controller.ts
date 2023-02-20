import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { TwoFaService } from './two_fa.service';

@Controller('2-fa')
export class TwoFaController {
	constructor(
		private readonly two_FA_Service: TwoFaService,
		private readonly authService: AuthService
	) {}

	@Post('generate')		// maybe this could be a get??? idk
	@UseGuards(Jwt_Auth_Guard)
	async	register(@Req() req: any) : Promise<any>
	{
		const	otpauthUrl = await this.two_FA_Service.generate_secret(req.user);
		
		return	this.two_FA_Service.pipeQrCodeStream(otpauthUrl);
	}

	@Post('turn-on')
	@UseGuards(Jwt_Auth_Guard)
	async	turn_on_2fa(@Req() req: any, @Body('two_FA_code') code : string)
	{
		const	valid_code = await this.two_FA_Service.verifyCode(req.user.id, code);
		if(!valid_code)
		{
			// console.log("invalid 2fa code");
			throw new UnauthorizedException('Wrong authentication code');
		}
		// console.log("valid 2fa code");
		return	this.two_FA_Service.turn_on(req.user.id);
	}

	@Post('turn-off')
	@UseGuards(Jwt_Auth_Guard)
	async	turn_off_2fa(@Req() req: any, @Body('two_FA_code') code : string)
	{
		const	valid_code = await this.two_FA_Service.verifyCode(req.user.id, code);
		if(!valid_code)
		{
			// console.log("invalid 2fa code");
			throw new UnauthorizedException('Wrong authentication code');
		}
		// console.log("valid 2fa code");
		return	this.two_FA_Service.turn_off(req.user.id);
	}

	@Post('authenticate')
	@UseGuards(Jwt_Auth_Guard)
	async	authenticate(@Req() req: any, @Body('two_FA_code') code : string, @Res({passthrough: true}) res: any) : Promise<any>
	{
		const	valid_code = await this.two_FA_Service.verifyCode(req.user.id, code);
		if(!valid_code)
		{
			// console.log("invalid 2fa code");
			throw new UnauthorizedException('Wrong authentication code');
		}
		return (this.authService.sign_jwt_token(req.user.id, res, true));
	}







}