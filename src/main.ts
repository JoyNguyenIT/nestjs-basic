import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { TransformInterceptor } from './core/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const staticPath = join(process.cwd(), 'public');
  console.log('🧩 Static path:', staticPath, 'exists:', fs.existsSync(staticPath));
  // app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(__dirname, '../src', 'views'));
  app.setViewEngine('ejs');
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/');
  app.enableVersioning({
    type: VersioningType.URI, // Có 3 kiểu: URI, HEADER, MEDIA_TYPE
    defaultVersion: ['1', '2'],      // Version mặc định
  });

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  mongoose.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' });
  //config cookies
  app.use(cookieParser());

  //config cors
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
  });
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
