import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";

export type JwtPayload = {
	name: string,
	sub: string | Number,
	mail: string,
	is_two_FAed: boolean,
}

@Injectable()
export class Two_FA_Strategy extends PassportStrategy(Strategy, 'Two-FA')
{
	constructor(
		private readonly userService: UserService
	)
	{
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: "generic secret"
		});
	}

	async	validate(payload: JwtPayload)
	{
		console.log("2-fa guard validate");
		const user	= await this.userService.findUserById(Number(payload.sub));
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
			throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
		}
	}
}