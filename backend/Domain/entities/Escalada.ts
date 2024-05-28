import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Usuario } from "./Usuario";

@Entity()
export class Escalada extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  data: string;

  @Column({ nullable: true })
  observacao: string;

  @ManyToOne(() => Usuario, usuario => usuario.escaladas)
  usuario: number;

  @ManyToOne(() => Via, via => via.escaladas)
  via: number;
}
