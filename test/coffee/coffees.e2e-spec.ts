import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;
  const coffee = {
    name: 'Rayper test',
    brand: 'RayperXBrand test',
    flavors: ['Taro','Green Tea'],
};

  // ubah jadi beforeAll, karena tidak mau re-create apps e2e test
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        // panggil database test yang sudah dibuat di docker-compose
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
          type: 'postgres', 
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true
          })
      }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
    .post('/coffees').send(coffee as CreateCoffeeDto).expect(HttpStatus.CREATED)
    // .then(({ body }) => {
    //     const expectedCoffee = jasmine.objectContaining({
    //         ...coffee,
    //         flavors: jasmine.arrayContaining(
    //             coffee.flavors.map(name => jasmine.objectContaining({name})),
    //         )
    //     });
    //     expect(body).toEqual(expectedCoffee);
    // });
  });
  it.todo('Get All [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  // akan dijalankan setelah test selesai
  afterAll(async () => {
    await app.close();
  });
});
