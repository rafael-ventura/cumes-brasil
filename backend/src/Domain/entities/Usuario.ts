import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Colecao } from "./Colecao";
import { Imagem } from "./Imagem";
import { Escalada } from "./Escalada";
import { Via } from "./Via";

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

  @Column({ nullable: true })
  data_atividade: string;

  @Column({ nullable: true })
  clube_organizacao: string;

  @Column({ nullable: true })// cidade, estado e país
  localizacao: string;

  @Column({ nullable: true })
  biografia: string;

  @ManyToOne(() => Via , { nullable: true })
  @JoinColumn({ name: "via_preferida" })
  via_preferida: Via;

  @ManyToOne(() => Imagem, imagem => imagem.usuarios)
  foto_perfil: number;

  @OneToMany(() => Colecao, colecao => colecao.usuario)
  colecoes: Colecao[];

  @OneToMany(() => Escalada, escalada => escalada.usuarioId)
  escaladas: Escalada[];

}
