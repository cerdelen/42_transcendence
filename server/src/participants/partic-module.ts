// import { Module } from "@nestjs/common";
// import { ParticipantsService } from './participants.service';
// import { Services } from "src/utils/consts";
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { PrismaService } from '../prisma/prisma.service';


// @Module({
// 	imports: [PrismaModule],
// 	providers: [{
// 		provide: Services.PARTICIPANTS,
// 		useClass: ParticipantsService,
// 	}],
// 	exports: [
// 		{
// 			provide: Services.PARTICIPANTS,
// 			useClass: ParticipantsService
// 		}
// 	]
// })
 
// export class ParticipantsModule {}