import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Via } from './Via';
import { Usuario } from './Usuario';
import {ColecaoBase} from "./ColecaoBase";

@Entity()
export class Escalada {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Via)
    via: Via | undefined;

    @Column()
    data: Date | undefined;

    @Column({ nullable: true })
    observacao: string | undefined;

    @ManyToOne(() => Usuario, usuario => usuario.historicoEscaladas)
    usuario: Usuario | undefined;
}

@Entity()
export class ColecaoEscaladas extends ColecaoBase {
    @OneToMany(() => Escalada, escalada => escalada.usuario, { cascade: true })
    escaladas: Escalada[] | undefined;
}
