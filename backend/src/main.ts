// backend\src\main.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { seedAdmin } from '@/database/seeds/admin.seed';
import { LoggerService } from '@nestjs/common';
import { LOGGER } from '@/core/application/ports/logger.token';

import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  // 🔹 Logger global
  app.useLogger(app.get<LoggerService>(LOGGER));
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

  app.enableCors({
    origin: 'http://localhost:5173', // tu frontend (React)
    credentials: true,
  });

  // 🔹 Swagger
  const config = new DocumentBuilder()
    .setTitle('API Inmobiliaria')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresar token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'API Inmobiliaria Docs',
  });

  // 🔹 Seed automático (solo si querés)
  const dataSource = app.get(DataSource);
  await seedAdmin(dataSource);

  // 🔹 Listen
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`📚 Swagger en http://localhost:${PORT}/docs`);
}

bootstrap();
