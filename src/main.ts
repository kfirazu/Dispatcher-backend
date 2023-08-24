import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupApp } from './setup-app';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setupApp(app)
  await app.listen(3000)
}
bootstrap();
