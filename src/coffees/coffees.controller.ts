import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { response } from 'express';

@Controller('coffees')
export class CoffeesController {

    @Get()
    // @Res -> Mengirim Response
    // findAll(@Res() response) {
        findAll() {
        // kalau pakai code seperti ini, akan lebih sulit untuk ditest, karena kehilangan compability dengan Nest Features
        // yang bergantung dengan standart response handling seperti interceptors dan @HttpCode
        // selain itu, code kita juga akan menjadi platform dependent
        // response.status(200).send('return all coffees with many flavors');
        return 'return all coffees with many flavors';    
    }

    @Get(':id')
    // dengan @param() memungkinkan kita untuk grab all incoming request from parameter
    // dan menggunakanya di dalam function body pada method kita
    // terkadang kita tidak ingin mengakses semua parameter pada object
    // dengan itu kita bisa menggunakan @Param decorator, untuk mendapatkan opsi untuk passing pada string 
    // pada porsi parameters
    findOne(@Param('id') id: string) {
        return `this action returns #${id} coffee`;
    }

    @Post()
    // HttpStatus.namaStatusnya sudah disediakan Nest jadi tinggal pilih
    @HttpCode(HttpStatus.GONE)
    // Body -> data / request yang kita kirimkan
    // kalau pada Body ditambahin sebuah string sebagai validasi, maka akan hanya me-return string name tersebut
    create(@Body() body) {
        return body;
    }
}
