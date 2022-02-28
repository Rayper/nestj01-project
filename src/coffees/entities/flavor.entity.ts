import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Coffee } from "./coffee.entity";

@Entity()
export class Flavor{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // assign coffe entity disini 
    @ManyToMany(
        type => Coffee,
        coffee => coffee.flavors
        )
    coffees: Coffee[];
}
