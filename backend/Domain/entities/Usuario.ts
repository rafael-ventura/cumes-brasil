import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colecao } from "./Colecao";

@Entity()
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  fotoPerfil?: string;

  @OneToMany(() => Colecao, colecao => colecao.usuario)
  colecoes: Colecao[];

  constructor (id: number, nome: string, email: string, password_hash: string, fotoPerfil?: string) {
    super();
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.password_hash = password_hash;
    this.fotoPerfil = fotoPerfil;

  }

  public atualizarFotoPerfil (novaFoto: string) {
    this.fotoPerfil = novaFoto;
  }

  public atualizarEmail (novoEmail: string) {
    this.email = novoEmail;
  }

}
