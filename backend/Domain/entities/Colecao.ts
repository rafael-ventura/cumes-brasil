import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Imagem } from "./Imagem";
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
  usuario: Usuario;

  @Column({ nullable: false })
  usuario_id: number;

  @ManyToOne(() => Imagem, imagem => imagem.colecoes)
  imagem: Imagem;

  @Column({ nullable: true })
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
