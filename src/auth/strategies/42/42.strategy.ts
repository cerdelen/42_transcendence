import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

@Injectable()
export class strategy42 extends PassportStrategy(Strategy, '42'){
	constructor(){
		super({
			clientID: "u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284",
			secret: "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",	
			CB_URL: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2F127.0.0.1%2Flogin%2F42%2Freturn&response_type=code",
		})
	}

	validate(){

	}
}