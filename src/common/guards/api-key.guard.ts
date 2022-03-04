import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // buat variable requst untuk dapetin request-nya
    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.header('Authorization');
    // compoare API_KEY yang telah dibuat pada .env
    return authHeader === process.env.API_KEY;
  }
}
