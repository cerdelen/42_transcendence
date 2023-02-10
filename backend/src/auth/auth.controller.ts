import { Controller, Get } from '@nestjs/common';
import { workerData } from 'worker_threads';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController 
{
	constructor(private authService: AuthService) {}

	@Get('login')
	login(): string 
	{
		this.authService.adduser("usernameveryintuitive");
		return "Login worked";
	}
	@Get('logout')
	logout(): string 
	{
		this.authService.deleteuser("usernameveryintuitive");
		return "Logout worked";
	}

}
