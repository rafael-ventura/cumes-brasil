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

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuario_id" })
  usuario_id: number;

  @ManyToOne(() => Via)
  @JoinColumn({ name: "via_id" })
  via_id: number;
}
