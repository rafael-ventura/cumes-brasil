import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Imagem } from './Imagem';
import { Usuario } from './Usuario';
import { ViaColecao } from './ViaColecao';

@Entity()
export class Colecao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fantasia: string;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Usuario, usuario => usuario.colecoes)
  usuario: Usuario;

  @ManyToOne(() => Imagem, imagem => imagem.colecoes)
  @Column({ nullable: true })
  imagem?: number;

  @OneToMany(() => ViaColecao, viaColecao => viaColecao.colecao)
  viaColecoes: ViaColecao[];
}
