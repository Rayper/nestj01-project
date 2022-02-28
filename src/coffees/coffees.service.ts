import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

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
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>
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

    async create(createCoffeeDto: CreateCoffeeDto) {
        // loop semua flavors yang ada pada database, untuk ditambahkan pada table coffee
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName((name))),
        );
        // ambil semua data dari createCoffeeDto dan juga dari variable flavors
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        });

        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeDto: UpdateCoffeeDto) {
        // preload -> membuat sebuah entity baru berdasarkan object yang diwariskan di dalamnya
        // ketika entity sudah ada di db, maka akan data lama akan ditimpah oleh data baru yang telah dikirim 

        // method untuk memastikan bahwa data coffe yang akan diupdate mempunyai flavors sebelum map data update
        // untuk mengatasi masalah flavors undefined
        const flavors = 
            updateCoffeDto.flavors && (await Promise.all(
                updateCoffeDto.flavors.map(name => this.preloadFlavorByName((name))),
        ));

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeDto,
            flavors
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

    // method untuk cek apakah flavors yang akan dicreate sudah ada atau belum di database
    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({name});
        if(existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create({name});
    }

}
