import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Face } from "./Face";
import { Via } from "./Via";

@Entity()
export class Montanha {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome: string | undefined;

    @Column()
    localizacao: string | undefined;

    @Column({ type: "double" })
    altura: number | undefined;

    @OneToMany(() => Face, face => face.montanha, { cascade: true })
    faces: Face[] | undefined;

    @OneToMany(() => Via, via => via.montanha, { cascade: true })
    vias: Via[] | undefined;
}
