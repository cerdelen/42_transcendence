import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { AuthService } from "../auth.service";
import { User } from '@prisma/client'

export type JwtPayload = {
	name: string,
	sub: string | Number,
	mail: string,
	is_two_FAed: boolean,
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
	constructor(private readonly authService: AuthService)
	{
		super
		({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// ignoreExpiration: false,									// after testing enable again (disabled because testuser token hardcoded)
			secretOrKey: "generic secret"
		});
	}

	async	validate(payload: JwtPayload) : Promise <User>
	{
		console.log("validate jwt strategy")
		
		const user = await this.authService.validate_user(payload);
		if(!user)
		{
			console.log("Jwt guard validate invalid token");
			throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
		}
		return (user);
	}
}
