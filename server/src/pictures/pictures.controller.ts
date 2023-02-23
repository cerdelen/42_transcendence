import { Controller, UseGuards, Post, Get, UseInterceptors, Body, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PicturesService } from './pictures.service';

@Controller('pictures')
export class PicturesController
{
	constructor(
		private readonly	userService:	UserService,
		private readonly	pictureService:	PicturesService,
		) {}



	@UseGuards(Jwt_Auth_Guard)
	@Post('upload')
	@UseInterceptors(FileInterceptor('file',
		{
			storage: diskStorage({
				destination: './uploads/profile_pictures', // obv this wont work
				filename: (req, file, cb) => {
					const random_name = Array(32).fill(null).map(()=> (Math.round(Math.random() * 16)).toString(16)).join('')
					return cb(null, `${random_name}${extname(file.originalname)}`)
				}
			})
		}
	)
	)
	async	upload_picture(@Body() _body, @UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({ maxSize: 300000 }),
				new FileTypeValidator({ fileType: '.(png|jpeg|jpg)'})
			],
		}),
	) file, @Req() _req: any)
	{
		console.log("hello inside upload picture");
		if(file != undefined)
		{
			console.log("picture is not undefined");
			await	this.pictureService.upload_picture({
				where: {id: _req.user.id},
				data: {picture: `${file.filename}`}
			});
		}
	}

	@UseGuards(Jwt_Auth_Guard)
    @Get('me')
	async	get_my_picture(@Res() _res, @Req() _req: any) : Promise<any>
	{
		const picture = await (await this.userService.findUserById(_req.user.id)).picture;
		_res.sendfile(picture, {root: './uploads/profile_pictures'});
	}
	
	@UseGuards(Jwt_Auth_Guard)
    @Get(':userId')
	async	get_my_picture_by_id(@Param('userId') userId, @Res() _res: any) : Promise<any>
	{
		const picture = await (await this.userService.findUserById(userId)).picture;
		_res.sendfile(picture, {root: './uploads/profile_pictures'});
	}

}
