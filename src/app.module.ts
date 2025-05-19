import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { ClientModule } from './client/client.module';

import { ArticleModule } from './article/article.module';
import { DatabaseModule } from './database/database.module';
import { HachageModule } from './hachage/hachage.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UtilisateurModule, ClientModule, ArticleModule,DatabaseModule,HachageModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
