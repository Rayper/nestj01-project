import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({})
// untuk membuatnya menjadi dynamic buat static class
export class DatabaseModule {
    static register(options: ConnectionOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: createConnection(options),
                },
            ],
        };
    }
}
