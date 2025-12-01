import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cidade } from './Cidade';
import { Localizacao } from './Localizacao';

@Entity()
@Index(['cidade'])
@Index(['nome'])
export class Bairro extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Cidade, cidade => cidade.bairros, { nullable: false })
  cidade: Cidade;

  @OneToMany(() => Localizacao, localizacao => localizacao.bairro)
  localizacoes: Localizacao[];
}