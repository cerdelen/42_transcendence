import { Injectable } from '@nestjs/common';

@Injectable()
export class TwoFaService {

	async	verifyCode(userid: number, code: string, res: any) : Promise <any>
	{
		
	}
}
