import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
        // dipakai ketika error terjadi di code kita yang sangat banyak baris code nya maupun error dari third app
        // throw 'A Random Error';
        const coffee = this.coffees.find(item => item.id === +id);
        // jika coffe yang dicari gak ada, throw error
        if(!coffee) {
            // throw new HttpException(`Coffe #${id} not found`, HttpStatus.NOT_FOUND);
            // bisa juga dengan cara 
            throw new NotFoundException(`Coffe #${id} not found`);
        }
        return coffee;
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
