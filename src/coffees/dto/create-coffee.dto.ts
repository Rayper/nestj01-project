import { IsString } from "class-validator";

export class CreateCoffeeDto {

    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    // each true -> untuk properties yang berupa array
    @IsString({each: true})
    readonly flavors: string[];
}
