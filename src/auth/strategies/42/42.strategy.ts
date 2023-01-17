import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Auth42Dto } from '../../dto';

import { Strategy, VerifyCallback } from "passport-42";

@Injectable()
export class strategy42 extends PassportStrategy(Strategy, '42'){
	constructor(){
		super({
			clientID: "u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284",
			clientSecret: "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",
			callbackURL: "http://localhost:3333/auth42/callback",
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback): Promise<void> {
			
			console.log("inside validate 42 funciton");
			const user: Auth42Dto = {
				id: +profile.id,
				email: profile.emails[0].value,
				intra: profile.username,
				firstname: profile.name.givenName,
				lastname: profile.name.familyName,
				username: profile.username,
				// picture: profile._json.image.link,
				// campus: profile._json.campus[0].name,
				// country: profile._json.campus[0].country,
				// coalition: profile.coalition,
				// twoFAEnable: false,
			};
			console.log(user.id);
			done(null, { ...user, accessToken });
	}
}




// profileFields: {
//     'id': function (obj) { return String(obj.id); },
//     'username': 'login',
//     'displayName': 'displayname',
//     'name.familyName': 'last_name',
//     'name.givenName': 'first_name',
//     'profileUrl': 'url',
//     'emails.0.value': 'email',
//     'phoneNumbers.0.value': 'phone',
//     'photos.0.value': 'image_url'
//   }

// async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallBack,
//   ): Promise<void> {
//     const user: CreateUserInput = {
//       id: +profile.id,
//       email: profile.emails[0].value,
//       intra: profile.username,
//       firstname: profile.name.givenName,
//       lastname: profile.name.familyName,
//       username: profile.username,
//       picture: profile._json.image.link,
//       campus: profile._json.campus[0].name,
//       country: profile._json.campus[0].country,
//       coalition: 'Fluvius',
//       twoFAEnable: false,
//       title: this.clean_42_title(
//         profile._json.titles,
//         this.titusPullus(profile._json.titles_users),
//       ),
//     };
//     done(null, { ...user, accessToken });
//   }