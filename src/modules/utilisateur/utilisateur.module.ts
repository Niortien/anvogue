import { Global, Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { PrismaService } from 'src/database/prisma.service';
@Global()
@Module({
  controllers: [UtilisateurController],
  providers: [UtilisateurService,PrismaService],
})
export class UtilisateurModule {}
