import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Via } from "./Via";
import { Usuario } from "./Usuario";

@Entity()
export class Colecao extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Usuario, usuario => usuario.colecoes)
  @JoinColumn({ name: "usuario_id" })
  usuario: Usuario;

  @Column()
  usuario_id: number;

  @ManyToMany(() => Via)
  @JoinTable({
    name: "colecao_via",
    joinColumn: {
      name: "colecao_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "via_id",
      referencedColumnName: "id"
    }
  })
  vias: Via[];

  public popularVia (via: Via): void {
    if (!this.vias) {
      this.vias = [];
    }
    this.vias.push(via);
  }
}
