import { Type } from "class-transformer";
import { IsOptional, IsPositive, isPositive } from "class-validator";

export class PaginationQueryDto {

    // untuk memastikan bahwa parameter yang dikirimkan untuk pagination adalah sebuah number
    @IsOptional()
    @IsPositive()
    limit: number;

    @IsOptional()
    @IsPositive()
    offset: number;
}
