import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    // pakai sebagai database
    // private coffees: Coffee[] = [
    //     {
    //         id: 1,
    //         name: "Raihan",
    //         brand: "Rayper",
    //         flavors: ['chocolate', 'cookies n cream']
    //     },
    //     {
    //         "id": 2,
    //         "name": "Kiko",
    //         "brand": "Kiko CoffeeShop",
    //         "flavors": ["Vanilla", "Green Tea"]
    //     }
    // ];
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
    ){}

    findAll() {
        return this.coffeeRepository.find({relations: ['flavors']});
    }

    async findOne(id: string) {
        // dipakai ketika error terjadi di code kita yang sangat banyak baris code nya maupun error dari third app
        // throw 'A Random Error';
        const coffee = await this.coffeeRepository.findOne(id , {relations: ['flavors']});
        // jika coffe yang dicari gak ada, throw error
        if(!coffee) {
            // throw new HttpException(`Coffe #${id} not found`, HttpStatus.NOT_FOUND);
            // bisa juga dengan cara 
            throw new NotFoundException(`Coffe #${id} not found`);
        }
        return coffee;
    }

    create(creaCoffeeDto: CreateCoffeeDto) {
        const coffee = this.coffeeRepository.create(creaCoffeeDto);
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeDto: UpdateCoffeeDto) {
        // preload -> membuat sebuah entity baru berdasarkan object yang diwariskan di dalamnya
        // ketika entity sudah ada di db, maka akan data lama akan ditimpah oleh data baru yang telah dikirim 
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeDto,
        });
        // preload akan return undefined jika id tidak ditemukan
        // oleh karena itu, selalu validasi dengan throw an exception
        if(!coffee){
            throw new NotFoundException(`Coffe #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        // dapetin dulu idnya
        const coffee = await this.coffeeRepository.findOne(id);
        // lalu didelete
        return this.coffeeRepository.remove(coffee);
    }

}
