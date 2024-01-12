import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Montanha } from "./Montanha";
import { Via } from "./Via";

@Entity()
export class Face {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome: string | undefined;

    @ManyToOne(() => Montanha, montanha => montanha.faces)
    montanha: Montanha | undefined;

    @OneToMany(() => Via, via => via.face, { cascade: true })
    vias: Via[] | undefined;
}
