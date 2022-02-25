import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    // pakai sebagai database
    private coffees: Coffee[] = [
        {
            id: 1,
            name: "Raihan",
            brand: "Rayper",
            flavors: ['chocolate', 'cookies n cream']
        }
    ];

    findAll() {
        return this.coffees;
    }

    findOne(id: string) {
        return this.coffees.find(item => item.id === +id);
    }

    create(creaCoffeeDto: any) {
        this.coffees.push(creaCoffeeDto);
    }

    update(id: string, updateCoffeDto: any) {
        // cek coffe yang akan di update
        const existingCoffe = this.findOne(id);
        if (existingCoffe) {

        }
    }

    remove(id: string) {
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if(coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }

}
