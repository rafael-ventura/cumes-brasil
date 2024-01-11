import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Face } from "./Face";
import { Via } from "./Via";

@Entity()
export class Montanha {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    localizacao: string;

    @Column({ type: "double" })
    altura: number;

    @OneToMany(() => Face, face => face.montanha, { cascade: true })
    faces: Face[];

    @OneToMany(() => Via, via => via.montanha, { cascade: true })
    vias: Via[];
}
