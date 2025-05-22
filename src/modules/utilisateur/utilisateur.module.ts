import { Global, Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
@Global()
@Module({
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
  exports: [UtilisateurService]
})
export class UtilisateurModule {}
