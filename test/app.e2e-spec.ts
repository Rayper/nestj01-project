import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // ubah jadi beforeAll, karena tidak mau re-create apps e2e test
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      // untuk ngatasin error 403 Forbidden
      .set('Authorization', process.env.API_KEY)
      .expect(200)
      .expect('Hello World!');
  });

  // akan dijalankan setelah test selesai
  afterAll(async () => {
    await app.close();
  });
});
