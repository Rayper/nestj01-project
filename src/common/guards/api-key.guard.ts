import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    // reflector class => sebuah helper yang mengizinkan mengambil setmetedata dari spesifik context
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    // validasi ketika itu adalah public / bukan
    if (isPublic) {
      return true;
    }
    // buat variable requst untuk dapetin request-nya
    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.header('Authorization');
    // compoare API_KEY yang telah dibuat pada .env
    return authHeader === this.configService.get('API_KEY');
    // return true;
  }
}
