import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// ketika kita inject sebenarnya kita set scopenya scope.Default
@Injectable()
// @Injectable({scope: Scope.REQUEST})
// @Injectable({scope: Scope.TRANSIENT})
export class CoffeesService {
    
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        private readonly configService: ConfigService,
        // ini cara inject dependency useValue dan providers
        // @Inject(COFFEE_BRANDS) coffeeBrands: string[], 
    ){
        // cek untuk providers transient dan request scoped
        // console.log("CoffeeService instantiated");
        // console.log(coffeeBrands);
        // print database host yang kita gunakan
        // parameter kedua adalah default value yang bisa kita tentukan
        // const databaseHost = this.configService.get<string>('DATABASE_HOST', 'localhost');
        // ngambil properties host dari object database yang ada pada appconfig
        // namun menggunakan ini akan riskan menimbulakn error seperti typo
        const databaseHost = this.configService.get('database.host', 'localhost');
        console.log(databaseHost);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const {limit, offset} = paginationQuery;

        return this.coffeeRepository.find({
            relations: ['flavors'],
            // skip untuk data yang ke berapa
            skip: offset,
            // mau ambil berapa per-page
            take: limit
        });
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

    // method untuk buat recommendation coffee
    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = {coffeeId: coffee.id};

            // insert to coffee entities
            await queryRunner.manager.save(coffee);
            
            // insert to event entities
            await queryRunner.manager.save(recommendEvent);

        } catch (error) {
            await queryRunner.commitTransaction();
        } finally {
            
            // memastikan setelah query Runner selesai, akan di close / release
            await queryRunner.release();
        }
    }

}
