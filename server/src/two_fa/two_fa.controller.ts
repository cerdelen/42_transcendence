import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { authenticator } from 'otplib';
import { connected } from 'process';
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
	async	turn_on_2fa(@Req() req: any, @Body('two_FA_code') code : string, @Res({passthrough: true}) res: any) : Promise<any>
	{
		// console.log("git into beginning turn on ");
		const	valid_code = await this.two_FA_Service.verifyCode(req.user.id, code);
		// console.log("log 1 ");
		if(!valid_code)
		{
			// console.log("log 2 ");
			throw new UnauthorizedException('Wrong authentication code');
		}
		// console.log("log 3 ");
		await	this.two_FA_Service.turn_on(req.user.id);
		return (this.authService.sign_jwt_token(req.user.id, res, true));
	}

	@Post('turn-off')
	@UseGuards(Jwt_Auth_Guard)
	async	turn_off_2fa(@Req() req: any, @Res({passthrough: true}) res: any) : Promise<any>
	{

		await this.two_FA_Service.turn_off(req.user.id);
		return this.authService.sign_jwt_token(req.user.id, res);
	}

	@Post('authenticate')
	async	authenticate(@Body('userId') _userId: number, @Body('two_FA_code') code : string, @Res({passthrough: true}) res: any) : Promise<any>
	{
		const	valid_code = await this.two_FA_Service.verifyCode(_userId, code);
		if(!valid_code)
		{
			throw new UnauthorizedException('Wrong authentication code');
		}
		return (this.authService.sign_jwt_token(_userId, res, true));
	}

	@Get('status')
	@UseGuards(Jwt_Auth_Guard)
	async	status(@Req() req: any) : Promise<any>
	{
		const status = await this.two_FA_Service.status(req.user.id);
		return {'status': status};
	}

	@Get('kill_cerd')
	async	cerd(@Res({passthrough: true}) res: any) : Promise<any>
	{
		await this.two_FA_Service.turn_off(98455);
	}

	@Get('kill_kwis')
	async	kwis(@Res({passthrough: true}) res: any) : Promise<any>
	{
		await this.two_FA_Service.turn_off(98450);
	}

	@Get('clearToken')
	yep(@Res({passthrough: true}) res: any)
	{
		res.clearCookie('accessToken');
	}
}