// import { ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';
// import { AuthDto } from './dto';
// import * as bcrypt from 'bcrypt'
// import { Tokens } from './types';

// @Injectable()
// export class AuthService {
// 	constructor(
// 			private prisma: PrismaService,
// 			private jwtService: JwtService,
// 		) {}

	
// 	async signupLocal(dto: AuthDto): Promise<Tokens> {
// 		const hash = await this.hashData(dto.password);
// 		const newUser = await this.prisma.user.create({
// 			data: {
// 				email: dto.email,
// 				hash
// 			}
// 		})
		
// 		const tokens = await this.getTokens(newUser.id, newUser.email)
// 		await this.updateRtHash(newUser.id, tokens.refresh_token);
// 		return tokens;
// 	}

	
// 	async signinLocal(dto: AuthDto): Promise<Tokens> {
// 		const user = await this.prisma.user.findUnique({
// 			where: {
// 				email: dto.email,
// 			}
// 		})

// 		if(!user) throw new ForbiddenException("Access Denied!");

// 		const passwordMatches = await  bcrypt.compare(dto.password, user.hash);
// 		if (!passwordMatches) throw new ForbiddenException("Access Denied!");

// 		const tokens = await this.getTokens(user.id, user.email)
// 		await this.updateRtHash(user.id, tokens.refresh_token);
// 		return tokens;
// 	}
	
// 	logout() {}
	
// 	refreshTokens() {}
	
// 	async updateRtHash(userId: number, rt: string) {
// 		const hash = await this.hashData(rt);
// 		await this.prisma.user.update({
// 			where: {
// 				id: userId,
// 			},
// 			data: {
// 				hashedRt: hash,
// 			},
// 		});
// 	}

// 	hashData(data: string) {
// 		return bcrypt.hash(data, 10);
// 	}

// 	async getTokens(userId: number, email: string): Promise<Tokens> {
// 		const [at, rt] = await Promise.all([
// 			this.jwtService.signAsync(
// 				{
// 					sub: userId,
// 					email,
// 				},
// 				{
// 					secret: 'at-secret',
// 					expiresIn: 60 * 15,				// takes seconds (15 minutes = 15 * 60)
// 				},
// 			),
// 			this.jwtService.signAsync(
// 				{
// 					sub: userId,
// 					email,
// 				},
// 				{
// 					secret: 'rt-secret',
// 					expiresIn: 60 * 60 * 24 * 7,				// 1 week
// 				},
// 			),
// 		])
// 		return {
// 			access_token: at,
// 			refresh_token: rt,
// 		}
// 	}
// }
