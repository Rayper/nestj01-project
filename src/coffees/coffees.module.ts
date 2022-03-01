import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// class MockCoffeesService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        { provide: COFFEE_BRANDS, useValue: ['Starbucks', 'Kopi Janji Jiwa'] }
    ],
    // ketika membuat sebuah class MockCoffeesService, maka saat menggunakan syntax useValue ini
    // ketika CoffeeService TOKEN dijalankan atau selesai, maka akan dimasukan ke dalam MockCoffeesService
    // setiap kali kita inject CoffeeService 
    // providers: [{provide: CoffeesService, useValue: new MockCoffeesService() }],
    exports: [CoffeesService],
})
export class CoffeesModule {}
