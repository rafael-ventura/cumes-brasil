import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colecao } from "./Colecao";
import { Imagem } from "./Imagem";

@Entity()
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password_hash: string;

  @ManyToOne(() => Imagem)
  Imagem: Imagem;

  @Column({ nullable: true })
  imagem_id: number;

  @OneToMany(() => Colecao, colecao => colecao.usuario)
  colecoes: Colecao[];

}
