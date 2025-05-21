import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';


async function bootstrap() {
  // creation de l'app de base nest
  const app = await NestFactory.create(AppModule);
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
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
