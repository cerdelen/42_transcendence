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
			ignoreExpiration: false,
			secretOrKey: "generic secret"
		});
	}

	async	validate(payload: JwtPayload) : Promise <User>
	{
		console.log("validate jwt strategy")
		// console.log(payload);
		// console.log(payload.is_two_FAed);
		const user = await this.authService.validate_user(payload);
		if(!user)
			throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
		return (user);
	}
}
