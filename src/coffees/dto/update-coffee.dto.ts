import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

// ini cara untuk mengurangi redundant code, jadi dia ngambil semua properties dari create
// dengan optional, tidak hanya duplicate properties. Decoratornya pun diduplicate
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto){}
