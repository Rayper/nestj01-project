import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() // sql table === "coffee"
export class Coffee{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    brand: string;

    // seperti ini karena dia array of string
    @Column('json', {nullable: true})
    flavors: string[];
}