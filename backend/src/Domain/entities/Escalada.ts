import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Usuario } from "./Usuario";
import { Participante } from "./Participante";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Escalada extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "date" })
  data: Date;

  @Column({ nullable: true })
  observacao: string;

  @OneToMany(() => Participante, participante => participante.escalada, { cascade: true })
  participantes: Participante[];

  @ManyToOne(() => Usuario, usuario => usuario.escaladas)
  usuario: Usuario;

  @ManyToOne(() => Via, via => via.escaladas)
  via: Via;
}
