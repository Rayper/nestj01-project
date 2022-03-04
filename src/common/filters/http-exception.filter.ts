import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    // buat switchHttp method sebuah variable untuk dapat memberikan kita akses untuk request / response objects
    const ctx = host.switchToHttp();
    // untuk getResponse nya dengan define type Response
    const response = ctx.getResponse<Response>();
    // dapetin status code
    const status = exception.getStatus();
    // get execption Response
    const exceptionResponse = exception.getResponse();
    // pertama cek dulu apakah response tersebut adalah sebuah string
    // jika itu sebuah string, maka akan membuat sebuah object dan memasukan sting tersebut ke dalam properti message
    // jika bukan maka akan di set sebagai object
    const error = 
      typeof response === 'string' ? {message: exceptionResponse} : (exceptionResponse as object);

    // set status code yang sudah kita buat
    // kirim execptionResponse kembali
    response.status(status).json({
      ...error,
      // buat ini untuk memastikan ExceptionFilter works, maka pada saat request lalu ada error
      // akan membuat sebuah response dengan properti timstamp 
      timeStamp: new Date().toISOString(),
    })
  }
}
