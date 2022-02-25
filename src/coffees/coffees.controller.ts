import { Controller, Get, Param } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {

    @Get('flavors')
    findAll() {
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
}
