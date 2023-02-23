import { Injectable, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {Prisma} from '@prisma/client'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class PicturesService
{
	constructor(
		private prisma: PrismaService
	) {}

	async	upload_picture(params: {
		where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
	})
	{
		const	{where, data} = params;
		await this.prisma.user.update({
			data,
			where
		});
	}
}
