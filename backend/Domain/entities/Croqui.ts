import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import { Via } from './Via';

@Entity()
export class Croqui {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    imagemUrl: string | undefined;

    @Column()
    autor: string | undefined;

    @Column({ nullable: true })
    descricao: string | undefined;

    @ManyToMany(() => Via, via => via.croquis)
    @JoinTable({
        name: "vias_croquis",
        joinColumn: { name: "croqui_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "via_id", referencedColumnName: "id" }
    })
    vias: Via[] | undefined;
}