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
		const user	= await this.userService.findUserById(Number(payload.sub));
		if (!user.two_FA_enabled)
		{
			return (user);
		}
		else if (payload.is_two_FAed)
		{
			return (user);
		}
		else
		{
			throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
		}
	}
}
