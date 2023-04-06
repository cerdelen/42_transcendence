import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
	name: string,
	sub: number,
	mail: string,
	is_two_FAed: boolean,
}

@Injectable()
export class Two_FA_Strategy extends PassportStrategy(Strategy, 'Two-FA')
{
	constructor(
		private readonly userService: UserService,
		private configService: ConfigService
	)
	{
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// ignoreExpiration: false,									// after testing enable again (disabled because testuser token hardcoded)
			secretOrKey: configService.get('secret')
		});
		////console.log("2faENV" + configService.get('secret'));
		
	}

	async	validate(payload: JwtPayload)
	{
		////console.log("2-fa guard validate");
		const user	= await this.userService.findUserById(payload.sub);
		if (!user.two_FA_enabled)				// if 2-fa is disabled just return true
		{
			return (user);
		}
		else if (payload.is_two_FAed)			// if 2-fa is enabled and token is 2-fa'ed return true
		{
			return (user);
		}
		else
		{
			////console.log("2-fa guard validate invalid token");
			throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
		}
	}
}