import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [,
    // contoh penggunaan dynamic module yang telah dibuat pada database module
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      password: 'password',
      port: 5432
    }),
    CoffeesModule,  
  ],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
