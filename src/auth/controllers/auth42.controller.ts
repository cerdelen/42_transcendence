import { Controller, Get, UseGuards } from '@nestjs/common';
import { Auth42Guard } from '../guards/auth42.guard'


@Controller('auth42')
export class Auth42Controller {
	constructor() {}

	@Get('login')
	@UseGuards(Auth42Guard)
	login(): void {
		return ;
	}
}
