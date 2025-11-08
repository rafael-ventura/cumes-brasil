import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colecao } from "./Colecao";
import { Imagem } from "./Imagem";
import { Escalada } from "./Escalada";
import { Via } from "./Via";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Usuario extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  idade: number;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ nullable: true })
  data_atividade: string;

  @Column({ nullable: true })
  clube_organizacao: string;

  @Column({ nullable: true })
  localizacao: string;

  @Column({ nullable: true })
  biografia: string;

  @ManyToOne(() => Via, { nullable: true })
  @JoinColumn({ name: "via_preferida" })
  via_preferida: Via;

  @ManyToOne(() => Imagem, imagem => imagem.usuarios)
  foto_perfil: Imagem;

  @OneToMany(() => Colecao, colecao => colecao.usuario)
  colecoes: Colecao[];

  @OneToMany(() => Escalada, escalada => escalada.usuario)
  escaladas: Escalada[];

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordUrl: string;
}
