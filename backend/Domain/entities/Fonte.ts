import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Via } from './Via'; // Certifique-se de importar corretamente a entidade Via

@Entity()
export class Fonte {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Via, via => via.fonte)
    vias: Via[] | undefined;

    @Column()
    referencia: string | undefined;
}