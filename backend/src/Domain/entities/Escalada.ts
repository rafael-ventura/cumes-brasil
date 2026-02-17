import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Usuario } from "./Usuario";
import { Participante } from "./Participante";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
@Index(['usuario'])
@Index(['via'])
@Index(['data'])
@Index(['usuario', 'data'])
@Index(['via', 'data'])
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
