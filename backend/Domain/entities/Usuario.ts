import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  @JoinColumn({ name: "foto_perfil" })
  foto_perfil: number;

  @OneToMany(() => Colecao, colecao => colecao.usuario_id)
  colecoes: Colecao[];

}
