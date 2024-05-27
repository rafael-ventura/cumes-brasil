import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Usuario } from "./Usuario";

@Entity()
export class Escalada extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  data: string;

  @Column({ nullable: true })
  observacao: string;

  @ManyToOne(() => Usuario)
  Usuario: Usuario;

  @Column({ nullable: false })
  usuario_id: number;

  @ManyToOne(() => Via)
  Via: Via;

  @Column({ nullable: false })
  via_id: number;
}
