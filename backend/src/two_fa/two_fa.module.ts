import { Module } from '@nestjs/common';
import { TwoFaService } from './two_fa.service';
import { TwoFaController } from './two_fa.controller';

@Module({
  providers: [TwoFaService],
  controllers: [TwoFaController]
})
export class TwoFaModule {}
