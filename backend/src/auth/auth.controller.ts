import { Controller, Get } from '@nestjs/common';
import { workerData } from 'worker_threads';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController 
{
	constructor(private authService: AuthService) {}

	@Get('login')
	getSmth(): string {
		this.authService.adduser("usernameveryintuitive");
		return "worked";
	}
}
