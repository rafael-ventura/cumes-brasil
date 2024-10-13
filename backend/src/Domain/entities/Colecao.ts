import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Via } from './Via';
import { Imagem } from './Imagem';
import { Usuario } from './Usuario';

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

  @ManyToMany(() => Via, via => via.colecoes)
  @JoinTable({
    name: "via_colecao",
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
