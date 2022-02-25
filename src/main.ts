import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // setting ini supaya ketika ada unwanted properties, throw an error
    forbidNonWhitelisted: true
  }));
  await app.listen(3000);
}
bootstrap();
