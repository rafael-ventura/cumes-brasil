import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Usuario } from "./Usuario";
import { Participante } from "./Participante";

@Entity()
export class Escalada extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  data: string;

  @Column({ nullable: true })
  observacao: string;

  @OneToMany(() => Participante, participante => participante.escalada, { cascade: true })
  participantes: Participante[];

  @ManyToOne(() => Usuario, usuario => usuario.escaladas)
  usuarioId: number;

  @ManyToOne(() => Via, via => via.escaladas)
  viaId: number;
}
