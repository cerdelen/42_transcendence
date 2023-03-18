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
        private userService: UserService,
        private readonly prisma: PrismaService
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
			console.log("Uploading picture was successful");
			return ;
		}
		console.log("Uploading picture was unsuccessful");
	}

	@UseGuards(Jwt_Auth_Guard)
    @Get('me')
	async	get_my_picture(@Res() _res, @Req() _req: any) : Promise<any>
	{
		const picture = `./uploads/profile_pictures/${_req.user.id}.jpeg`;
		await fs.access(picture, (error) => {
			if (error) 
			{
			//   console.log("file does not exist");
				return _res.sendFile("default_picture.jpeg", {root: './uploads/profile_pictures'});
			}
			_res.sendFile(picture, {root: '.'});
			// console.log("File Exists!");
		});
	}
	
	
	@UseGuards(Jwt_Auth_Guard)
	@Get('turn_on_picture')
	async	turn_on_picture(@Req() _req: any)
	{
		console.log("\n\nTURNO ON PICTURE");
		return ( await this.userService.updateUser({where: {id: _req.user.id}, data: { show_default_image: true }}));
	}
	
	@UseGuards(Jwt_Auth_Guard)
	@Get('turn_off_picture')
	async	turn_off_picture(@Req() _req: any)
	{
		console.log("\n\nTURNO OFF PICTURE");
		return (await this.userService.updateUser({where: {id: _req.user.id}, data: { show_default_image: false }}));
	}

	@Get('is-image-default')
	@UseGuards(Jwt_Auth_Guard)
	async	status(@Req() req: any) : Promise<any>
	{
		const status = await this.userService.status_default_image(req.user.id);
		return {'status': status};
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get(':userId')
	async	get_my_picture_by_id(@Param('userId') userId, @Res() _res: any) : Promise<any>
	{
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
