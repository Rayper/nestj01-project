import { Injectable, Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from '../coffees/coffees.controller';
import { CoffeesService } from '../coffees/coffees.service';
import { Coffee } from '../coffees/entities/coffee.entity';
import { Flavor } from '../coffees/entities//flavor.entity';
import { Event } from '../coffees/entities/event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        { 
            provide: COFFEE_BRANDS, 
            useFactory: async () => ['Starbucks', 'Kopi Janji Jiwa'],
            // scope: Scope.TRANSIENT 
        },
    ],
    
    exports: [CoffeesService],
})
export class CoffeesModule {}
