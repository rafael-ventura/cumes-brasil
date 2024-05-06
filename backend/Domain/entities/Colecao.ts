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

  @Column()
  usuario_id: number;

  @ManyToMany(() => Via , via => via.colecoes)
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
  
}
