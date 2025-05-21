import { Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from 'src/modules/auth/otp/otp.module';
import { HachageModule } from 'src/modules/auth/hachage/hachage.module';
import { UtilisateurModule } from 'src/modules/utilisateur/utilisateur.module';
import { ClientModule } from 'src/modules/client/client.module';
@Module({
  imports: [JwtModule.register({}),HachageModule, OtpModule, UtilisateurModule, ClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
