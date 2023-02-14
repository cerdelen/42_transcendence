import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TwoFaService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async	generate_secret(user: User)
	{
		const	secret = authenticator.generateSecret();
		await	this.userService.updateUser({
			where: { id: user.id }, 
			data: { two_FA_secret: secret },
		});

		const	otpauthUrl = authenticator.keyuri(
				user.mail, 
				"Transcatdence",
				secret
			);

		return (otpauthUrl);
	}

	async	pipeQrCodeStream(otpauthUrl: string)
	{
		const	dataUrl = await toDataURL(otpauthUrl);
		return	dataUrl;
	}


	async	verifyCode(user_id: number, code: string) : Promise <any>
	{
		const	secret_2fa	= (await (this.userService.findUserById(user_id))).two_FA_secret;
		return	authenticator.verify({
			token: code,
			secret: secret_2fa,
		});
	}

	async	turn_off(user_id: number)
	{
		this.userService.turn_off_2FA(user_id);
	}
	
	async	turn_on(user_id: number)
	{
		this.userService.turn_on_2FA(user_id);
	}

	async	sign_jtw_token(user_id: number, res: any)
	{
		const	user	= await this.userService.findUserById(user_id);
		const	payload	= { username: user.name, sub: user.id, mail: user.mail };
		const	token	= this.jwtService.sign(payload, {secret: "jwtSecret"});
		res.cookie('accessToken', token);
		return (res.redirect('http://localhost:3000/'));
	}

}
