import { 
	Controller, 
	Get, 
	UseGuards,
	Req,	
} from '@nestjs/common';
import { Auth42Guard } from '../guards/auth42.guard'


@Controller('auth42')
export class Auth42Controller {
	constructor() {}

	@Get('login')
	@UseGuards(Auth42Guard)
	login(): void {
		return ;
	}


	@Get('callback')
	@UseGuards(Auth42Guard)
	async callback(@Req() req: any){
		console.log("hi from inside callback")
		console.log(req);
	}
}
