import { Controller, UseGuards, Post, Get, UseInterceptors, Body, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from 'src/user/user.service';
import { PicturesService } from './pictures.service';

import * as fs from 'fs'
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('pictures')
export class PicturesController
{
	constructor(
    ) {}

	@UseGuards(Jwt_Auth_Guard)
	@Post('upload')
	@UseInterceptors(FileInterceptor('file',
		{
			storage: diskStorage({
				destination: './uploads/profile_pictures',
				filename: (req: any, file, cb) => {
					const file_name = req.user.id;
					return cb(null, `${file_name}${extname(file.originalname)}`)
					// const random_name = Array(32).fill(null).map(()=> (Math.round(Math.random() * 16)).toString(16)).join('')
					// return cb(null, `${random_name}${extname(file.originalname)}`)
				}
			})
		}
	)
	)
	async	upload_picture(@Body() _body, @UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({ maxSize: 300000 }),
				new FileTypeValidator({ fileType: '.(jpeg)'})
			],
		}),
	) file, @Req() _req: any)
	{
		if(file != undefined)
		{
			////console.log("Uploading picture was successful");
			return ;
		}
		////console.log("Uploading picture was unsuccessful");
	}

	@UseGuards(Jwt_Auth_Guard)
    @Get('me')
	async	get_my_picture(@Res() _res, @Req() _req: any) : Promise<any>
	{
		const picture = `./uploads/profile_pictures/${_req.user.id}.jpeg`;
		await fs.access(picture, (error) => {
			if (error) 
			{
			//   ////console.log("file does not exist");
				return _res.sendFile("default_picture.jpeg", {root: './uploads/profile_pictures'});
			}
			_res.sendFile(picture, {root: '.'});
			// ////console.log("File Exists!");
		});
	}
	
	// @UseGuards(Jwt_Auth_Guard)
	@Get('group_chat')
	async	get_group_chat(@Param('userId') userId, @Res() _res: any) : Promise<any>
	{
		return _res.sendFile("group_chat_picture.jpeg", {root: './uploads/profile_pictures'});

	}

	@UseGuards(Jwt_Auth_Guard)
	@Get(':userId')
	async	get_my_picture_by_id(@Param('userId') userId, @Res() _res: any) : Promise<any>
	{
		// ////console.log("this is get picture by id " + userId);
		
		const picture = `./uploads/profile_pictures/${userId}.jpeg`;
		await fs.access(picture, (error) => {
			if (error) 
			{
				return _res.sendFile("default_picture.jpeg", {root: './uploads/profile_pictures'});
			}
			_res.sendFile(picture, {root: '.'});
		});
	}
}
