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
import { Imagem } from "./Imagem";
import { Usuario } from "./Usuario";

@Entity()
export class Colecao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Usuario, usuario => usuario.colecoes)
  @JoinColumn({ name: "usuario_id" })
  usuario_id: number;

  @ManyToOne(() => Imagem, imagem => imagem.colecoes)
  @JoinColumn({ name: "imagem_id" })
  imagem_id: number;

  @ManyToMany(() => Via, via => via.colecoes)
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
