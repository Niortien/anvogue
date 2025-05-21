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

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), UtilisateurModule, ClientModule, ArticleModule, HachageModule, AuthModule, OtpModule, AuditModule],
  controllers: [],
  providers: [],
})

export class AppModule { }
