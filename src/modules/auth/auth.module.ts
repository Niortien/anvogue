import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HachageService } from 'src/modules/auth/hachage/hachage.service';
import { UtilisateurService } from 'src/modules/utilisateur/utilisateur.service';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from 'src/modules/client/client.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,HachageService,UtilisateurService,JwtService,ClientService,PrismaService],
})
export class AuthModule {}
