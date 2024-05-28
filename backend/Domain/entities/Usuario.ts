import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colecao } from "./Colecao";
import { Imagem } from "./Imagem";
import { Escalada } from "./Escalada";

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

  @ManyToOne(() => Imagem, imagem => imagem.usuarios)
  foto_perfil: number;

  @OneToMany(() => Colecao, colecao => colecao.usuario)
  colecoes: Colecao[];

  @OneToMany(() => Escalada, escalada => escalada.usuario)
  escaladas: Escalada[];

}
