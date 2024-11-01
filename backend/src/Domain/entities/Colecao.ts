import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Imagem } from './Imagem';
import { Usuario } from './Usuario';
import { ViaColecao } from './ViaColecao';

@Entity()
export class Colecao extends BaseEntity {
  constructor (nome: string, descricao: string, usuario: number, imagem: number) {
    super();
    this.nome = nome;
    this.descricao = descricao;
    this.usuario = usuario;
    this.imagem = imagem;
  }

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

  @OneToMany(() => ViaColecao, viaColecao => viaColecao.colecao)
  viaColecoes: ViaColecao[];

}
