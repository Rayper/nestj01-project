import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // setting ini supaya ketika ada unwanted properties, throw an error
    forbidNonWhitelisted: true,
    // set ini ke true, karena pada saat kita buat createCoffeesdto: CreateCoffeesDto
    // createCoffeesdto bukan instance dari class CreateCoffeeDto
    // selain itu, transform jgau dapat otomatis menconvert paramter sebuah method menjadi sesuai yang kita mau
    transform: true,
    // alternative untuk @Type(() => Number)
    transformOptions: {
        enableImplicitConversion: true      
    }
  }));
  app.useGlobalFilters(new HttpExceptionFilter()); 
  await app.listen(3000);
}
bootstrap();
