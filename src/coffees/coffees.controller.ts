import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, Res, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { response } from 'express';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// bisa juga membuat instance dari sebuah class
// @UsePipes(new ValidationPipe())
// @UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {

    // readonly karena kita hanya menggunakan service dan tidak melakukan modify
    constructor(private readonly coffeeService: CoffeesService) {
        // test untuk scope Request
        // console.log("CoffeesController created!")
    }

    // bisa juga dipakai dimethod yang kita inginkan
    // @UsePipes(ValidationPipe)
    // (Key, Value)
    // @SetMetadata('isPublic', true)
    // customer decorators
    @Public()
    @Get()
    // findAll() {
        // @Res -> Mengirim Response
        // findAll(@Res() response) {
        async findAll(
                @Protocol('defaultValue') protocol: string, 
                @Query() paginationQuery: PaginationQueryDto) {
            // test untuk protocol decorator
            console.log(protocol);
            // untuk trigger interceptorTimeout
            // await new Promise(resolve => setTimeout(resolve, 5000));
            // kalau pakai code seperti ini, akan lebih sulit untuk ditest, karena kehilangan compability dengan Nest Features
            // yang bergantung dengan standart response handling seperti interceptors dan @HttpCode
            // selain itu, code kita juga akan menjadi platform dependent
            // response.status(200).send('return all coffees with many flavors');
            // const {limit, offset} = paginationQuery;
            // return `return all coffees with many flavors. Limit : ${limit}, offset : ${offset}`;
            // cara test-nya : http://localhost:3000/coffees?limit=10&offset=5
            return this.coffeeService.findAll(paginationQuery);    
    }
    
    @Public()
    @Get(':id')
    // dengan @param() memungkinkan kita untuk grab all incoming request from parameter
    // dan menggunakanya di dalam function body pada method kita
    // terkadang kita tidak ingin mengakses semua parameter pada object
    // dengan itu kita bisa menggunakan @Param decorator, untuk mendapatkan opsi untuk passing pada string 
    // pada porsi parameters
    // test parseInt Pipes
    findOne(@Param('id', ParseIntPipe) id: number) {  
        // test untuk parseInt pipes
        // console.log(id);
        // return `this action returns #${id} coffee`;
        // console.log(typeof id);
        return this.coffeeService.findOne('' + id);
    }

    @Post()
    // HttpStatus.namaStatusnya sudah disediakan Nest jadi tinggal pilih
    // @HttpCode(HttpStatus.GONE)
    // Body -> data / request yang kita kirimkan
    // kalau pada Body ditambahin sebuah string sebagai validasi, maka akan hanya me-return string name tersebut
    // seperti ini @Body('name')
    create(@Body() createCoffeDto: CreateCoffeeDto) {
        console.log(createCoffeDto instanceof CreateCoffeeDto);
        // return body;
        return this.coffeeService.create(createCoffeDto);
    }

    @Patch(':id')
    // parameter id dan body
    // contoh penggunaan param-scoped pipes yang hanya berfokus pada 1 parameter
    update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
        // return `this action updates #${id} coffee`;
        return this.coffeeService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        // return `this action removes #${id} coffee`;
        return this.coffeeService.remove(id);
    }
}
