import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Estado } from './Estado';
import { Bairro } from './Bairro';
import { Localizacao } from './Localizacao';

@Entity()
@Index(['estado'])
@Index(['nome'])
export class Cidade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Estado, estado => estado.cidades, { nullable: false })
  estado: Estado;

  @OneToMany(() => Bairro, bairro => bairro.cidade)
  bairros: Bairro[];

  @OneToMany(() => Localizacao, localizacao => localizacao.cidade)
  localizacoes: Localizacao[];
}