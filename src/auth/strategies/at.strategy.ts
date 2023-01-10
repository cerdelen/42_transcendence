import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from "@nestjs/common";
import { JwtSecretRequestType } from "@nestjs/jwt";

@Injectable()
export class AtSrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'at-secret',
		  });
	}

	validate(payload: any) {
		return payload;
	}
}