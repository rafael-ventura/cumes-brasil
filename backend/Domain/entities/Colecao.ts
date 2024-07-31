import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Via } from "./Via";
import { Imagem } from "./Imagem";
import { Usuario } from "./Usuario";
import { ColecaoVia } from "./ColecaoVia";

@Entity()
export class Colecao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Usuario, usuario => usuario.colecoes)
  usuario: number;

  @ManyToOne(() => Imagem, imagem => imagem.colecoes)
  imagem: number;

  @OneToMany(() => ColecaoVia, colecaoVia => colecaoVia.colecao, { cascade: true, onDelete: "CASCADE" })
  viasColecoes: ColecaoVia[];
}
