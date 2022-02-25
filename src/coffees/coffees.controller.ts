import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { response } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {

    // readonly karena kita hanya menggunakan service dan tidak melakukan modify
    constructor(private readonly coffeesService: CoffeesService) {

    }

    @Get()
    findAll() {
        // @Res -> Mengirim Response
        // findAll(@Res() response) {
        // findAll(@Query() paginationQuery) {
        // kalau pakai code seperti ini, akan lebih sulit untuk ditest, karena kehilangan compability dengan Nest Features
        // yang bergantung dengan standart response handling seperti interceptors dan @HttpCode
        // selain itu, code kita juga akan menjadi platform dependent
        // response.status(200).send('return all coffees with many flavors');
        // const {limit, offset} = paginationQuery;
        // return `return all coffees with many flavors. Limit : ${limit}, offset : ${offset}`;
        // cara test-nya : http://localhost:3000/coffees?limit=10&offset=5
        return this.coffeesService.findAll();    
    }

    @Get(':id')
    // dengan @param() memungkinkan kita untuk grab all incoming request from parameter
    // dan menggunakanya di dalam function body pada method kita
    // terkadang kita tidak ingin mengakses semua parameter pada object
    // dengan itu kita bisa menggunakan @Param decorator, untuk mendapatkan opsi untuk passing pada string 
    // pada porsi parameters
    findOne(@Param('id') id: string) {
        // return `this action returns #${id} coffee`;
        return this.coffeesService.findOne(id);
    }

    @Post()
    // HttpStatus.namaStatusnya sudah disediakan Nest jadi tinggal pilih
    // @HttpCode(HttpStatus.GONE)
    // Body -> data / request yang kita kirimkan
    // kalau pada Body ditambahin sebuah string sebagai validasi, maka akan hanya me-return string name tersebut
    create(@Body() createCoffeDto: CreateCoffeeDto) {
        // return body;
        return this.coffeesService.create(createCoffeDto);
    }

    @Patch(':id')
    // parameter id dan body
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        // return `this action updates #${id} coffee`;
        return this.coffeesService.update(id, UpdateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        // return `this action removes #${id} coffee`;
        return this.coffeesService.remove(id);
    }
}
