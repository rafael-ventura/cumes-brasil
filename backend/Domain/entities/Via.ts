import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinColumn,
    JoinTable,
} from "typeorm";
import { Croqui } from "./Croqui";
import { Montanha } from "./Montanha";
import { Face } from "./Face";
import { Fonte } from "./Fonte";
import { ColecaoBase } from "./ColecaoBase";

@Entity()
export class Via {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ nullable: true })
    grau: string;

    @Column({ nullable: true })
    crux: string;

    @Column({ nullable: true })
    artificial: string;

    @Column({ nullable: true })
    duracao: string;

    @Column({ nullable: true })
    exposicao: string;

    @Column({ type: "int", nullable: true })
    extensao: number;

    @Column({ type: "simple-array", nullable: true })
    conquistadores: string[];

    @Column({ nullable: true })
    detalhes: string;

    @Column({ type: "date", nullable: true })
    data: Date;

    @ManyToOne(() => Montanha, montanha => montanha.vias)
    @JoinColumn({ name: "montanha_id" })
    montanha: Montanha;

    @ManyToOne(() => Face, face => face.vias)
    @JoinColumn({ name: "face_id" })
    face: Face;

    @ManyToOne(() => Via, via => via.variantes)
    @JoinColumn({ name: "via_principal_id" })
    viaPrincipal: Via;

    @OneToMany(() => Via, via => via.viaPrincipal)
    variantes: Via[];

    @ManyToOne(() => Fonte, fonte => fonte.vias)
    @JoinColumn({ name: "fonte_id" })
    fonte: Fonte;

    @ManyToMany(() => Croqui, croqui => croqui.vias)
    croquis: Croqui[];

    @ManyToMany(() => ColecaoBase, colecaoBase => colecaoBase.vias)
    colecoes: ColecaoBase[];
}
