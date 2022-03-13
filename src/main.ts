import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const options = new DocumentBuilder()
  .setTitle('iluvcoffee')
  .setDescription('Coffee Application')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // app.useGlobalGuards(new ApiKeyGuard());
  app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter()); 
  await app.listen(3000);
}
bootstrap();
