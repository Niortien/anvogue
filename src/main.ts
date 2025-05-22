import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // creation de l'app de base nest
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // injecter globalement ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  //

  // configuration de mon swagger
  const config = new DocumentBuilder()
    .setTitle('Anvogue api')
    .setDescription('The anvogue API description')
    .setVersion('1.0')
    .addTag('anvogue')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  // connexion du serveur

  // Configuration du dossier de téléchargement
  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('Uploads directory path:', uploadsPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads'
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
