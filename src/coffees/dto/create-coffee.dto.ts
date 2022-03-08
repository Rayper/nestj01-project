import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
    // supaya bisa dibaca oleh Swagger
    @ApiProperty({description: "The name of a coffee."})
    @IsString()
    readonly name: string;

    @ApiProperty({description: "The name brand of a coffee."})
    @IsString()
    readonly brand: string;

    @ApiProperty({example: [] })
    // each true -> untuk properties yang berupa array
    @IsString({each: true})
    readonly flavors: string[];
}
