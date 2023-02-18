import { Module } from '@nestjs/common';
import { TwoFaService } from './two_fa.service';
import { TwoFaController } from './two_fa.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [UserModule],
  providers: [TwoFaService, JwtService, AuthService],
  controllers: [TwoFaController]
})
export class TwoFaModule {}
