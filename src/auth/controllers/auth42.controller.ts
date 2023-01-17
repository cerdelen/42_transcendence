import { 
	Controller, 
	Get, 
	UseGuards,
	Req,	
} from '@nestjs/common';
import { Auth42Guard } from '../guards/auth42.guard'
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('auth42')
export class Auth42Controller {
	constructor(private prisma: PrismaService) {}

	@Get('login')
	@UseGuards(Auth42Guard)
	login(): void {
		return ;
	}

	@Get('callback')
	@UseGuards(Auth42Guard)
	async callback(@Req() req: any){
		console.log("hi from inside callback")
		const user = req.user;
		const found = await this.prisma.user.findUnique({where: {id: user.id,}})
		if (!found)
		{
			this.createUser(user);
			console.log("created user");
		}
		else
			console.log("user already exists");
	}
	
	
	async	createUser(data: any) {
		await this.prisma.user.create({data})
	}
}
