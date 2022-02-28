import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

// Index dapat membantu mempercepat proses seperti contoh ketika ada request untuk search by Name
@Index(['name', 'type'])
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    name: string;

    @Column('json')
    payload: Record<string, any>
}
