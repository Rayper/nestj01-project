import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        { 
            provide: COFFEE_BRANDS,
            // ngecek akan menjalankan useFactory ketika database sudah established 
            useFactory: async (connection: Connection): Promise<string[]> => {
                const coffeeBrands = await Promise.resolve(['Kopi Janji Jiwa', 'Starbucks']);
                // console log ini akan di execute setelah console log coffee brands
                console.log('Async Factory [!]')
                return coffeeBrands;
            },
            inject: [Connection] 
        },
    ],
    
    exports: [CoffeesService],
})
export class CoffeesModule {}
