import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  // menghitung berapa lama seluruh request dan response berjalan
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    console.log("Middleware Called.. ");

    res.on('finish', () => console.timeEnd('Request-response time'));
    next();
  }
}
