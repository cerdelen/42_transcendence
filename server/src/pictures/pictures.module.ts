import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PicturesService, PrismaService],
  controllers: [PicturesController]
})
export class PicturesModule {}
