import { Module } from '@nestjs/common';
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { ClientModule } from './modules/client/client.module';

import { ArticleModule } from './modules/article/article.module';
import { DatabaseModule } from './database/database.module';
import { HachageModule } from './modules/auth/hachage/hachage.module';
import { AuthModule } from './modules/auth/auth.module';

import { OtpModule } from './modules/auth/otp/otp.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { FavorisModule } from './modules/client/favoris.module';
import { NoteModule } from './modules/client/note.module';
import { VarieteModule } from './modules/article/variete.module';
import { CollectionModule } from './collection/collection.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), CommonModule, UtilisateurModule, ClientModule, ArticleModule, HachageModule, AuthModule, OtpModule, AuditModule, NotificationModule, FavorisModule, NoteModule, VarieteModule, CollectionModule],
  controllers: [],
  providers: [],
})

export class AppModule { }
