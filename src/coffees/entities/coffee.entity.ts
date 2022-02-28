import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity() // sql table === "coffee"
export class Coffee{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    brand: string;

    // seperti ini karena dia array of string
    // @Column('json', {nullable: true})
    @JoinTable({
        name: 'coffees_flavors'
    })
    // Parameter pertama adalah mau join ke table mana
    @ManyToMany(
        type => Flavor, 
        (flavor) => flavor.coffees,
        {
            // akan otomatis insert flavors pada saat membuat coffees
            cascade: true // ['insert']
        }
        )
    flavors: Flavor[];
}