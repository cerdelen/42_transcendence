import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFaService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService
	) {}

	async	status(user_id: number): Promise<boolean>
	{
		const user = await this.prisma.user.findUnique({where: {id: user_id}});
		return user.two_FA_enabled;
	}

	async	generate_secret(user: User)
	{
		const p_user = await this.prisma.user.findUnique({where: { id: user.id}});
		// console.log((await p_user).two_FA_secret);
		if (p_user.two_FA_secret)
		{
			const	otpauthUrl = authenticator.keyuri(
				user.mail, 
				"Transcatdence",
				p_user.two_FA_secret
			);
			console.log("not creating new secret for 2-fa");
			return (otpauthUrl);
		}
		else
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
			console.log("i DID create a new secret for 2-fa");
			return (otpauthUrl);
		}
	}

	async	pipeQrCodeStream(otpauthUrl: string)
	{
		const	dataUrl = await toDataURL(otpauthUrl);
		return	dataUrl;
	}

	async	verifyCode(user_id: number, code: string) : Promise <any>
	{
		const	secret_2fa	= (await (this.userService.findUserById({id: user_id}))).two_FA_secret;
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

	async	test(user_id: number)
	{
		console.log("hello");
		const p_user = this.prisma.user.findUnique({where: { id: user_id}});
		console.log((await p_user).two_FA_secret);
		if((await p_user).two_FA_secret)
			console.log("is there")
		else
			console.log("is NOTTTT there")
	}

	
}
