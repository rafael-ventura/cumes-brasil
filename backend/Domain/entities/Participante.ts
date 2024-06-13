import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Escalada } from "./Escalada";

@Entity()
export class Participante extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    tipo: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ nullable: true })
    email: string;

    @ManyToOne(() => Escalada, escalada => escalada.participantes, { onDelete: "CASCADE" })
    escalada: Escalada;
}