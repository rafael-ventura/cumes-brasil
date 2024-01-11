import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Via } from './Via';
import { Usuario } from './Usuario';
import {ColecaoBase} from "./ColecaoBase";

@Entity()
export class Escalada {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Via)
    via: Via;

    @Column()
    data: Date;

    @Column({ nullable: true })
    observacao: string;

    @ManyToOne(() => Usuario, usuario => usuario.historicoEscaladas)
    usuario: Usuario;
}

@Entity()
export class ColecaoEscaladas extends ColecaoBase {
    @OneToMany(() => Escalada, escalada => escalada.usuario, { cascade: true })
    escaladas: Escalada[];
}
