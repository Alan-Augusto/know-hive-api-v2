import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ===== CLASS VALIDATOR =====
  app.useGlobalPipes(new ValidationPipe());


  // ===== CORS =====
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://know-hive.vercel.app'
    ],
    credentials: true,
  });

  // ===== STATIC ASSETS =====
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });


  // ======SWAGGER=====
    const config = new DocumentBuilder()
    .setTitle('KnowHive API')
    .setDescription('API responsável por gerenciar os elementos do app KnowHive, lidando com usuários, questões, coleções e respostas.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger disponível em /api

  // =================

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
