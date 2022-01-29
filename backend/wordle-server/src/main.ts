import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.1.35:3000'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3443);
}
bootstrap();
