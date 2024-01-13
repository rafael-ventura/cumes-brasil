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
    id!: number;

    @Column()
    nome: string | undefined;

    @Column({ nullable: true })
    grau: string | undefined;

    @Column({ nullable: true })
    crux: string | undefined;

    @Column({ nullable: true })
    artificial: string | undefined;

    @Column({ nullable: true })
    duracao: string | undefined;

    @Column({ nullable: true })
    exposicao: string | undefined;

    @Column({ type: "int", nullable: true })
    extensao: number | undefined;

    @Column({ type: "simple-array", nullable: true })
    conquistadores: string[] | undefined;

    @Column({ nullable: true })
    detalhes: string | undefined;

    @Column({ type: "date", nullable: true })
    data: Date | undefined;

    @ManyToOne(() => Montanha, montanha => montanha.vias)
    @JoinColumn({ name: "montanha_id" })
    montanha: Montanha | undefined;

    @ManyToOne(() => Face, face => face.vias)
    @JoinColumn({ name: "face_id" })
    face: Face | undefined;

    @ManyToOne(() => Via, via => via.variantes)
    @JoinColumn({ name: "via_principal_id" })
    viaPrincipal: Via | undefined;

    @OneToMany(() => Via, via => via.viaPrincipal)
    variantes: Via[] | undefined;

    @ManyToOne(() => Fonte, fonte => fonte.vias)
    @JoinColumn({ name: "fonte_id" })
    fonte: Fonte | undefined;

    @ManyToMany(() => Croqui, croqui => croqui.vias)
    croquis: Croqui[] | undefined;

    @ManyToMany(() => ColecaoBase, colecaoBase => colecaoBase.vias)
    colecoes: ColecaoBase[] | undefined;
}
