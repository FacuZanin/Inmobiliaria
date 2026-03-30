// backend\src\main.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { BadRequestException } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { seedAdmin } from './database/seeds/admin.seed';
import { AppLogger } from '@shared/infrastructure/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 🔹 Logger global
  app.useLogger(app.get(AppLogger));

  // 🔹 Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );

  // 🔹 Interceptor global
  // app.useGlobalInterceptors(new LoggingInterceptor());

  // 🔹 Swagger
  const config = new DocumentBuilder()
    .setTitle('API Inmobiliaria')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 🔹 Seed automático (solo si querés)
  const dataSource = app.get(DataSource);
  await seedAdmin(dataSource);

  // 🔹 Listen
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Swagger en http://localhost:${PORT}/docs`);
}

bootstrap();
