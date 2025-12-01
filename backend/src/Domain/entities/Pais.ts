import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Continente } from './Continente';
import { Regiao } from './Regiao';
import { Estado } from './Estado';
import { Localizacao } from './Localizacao';

@Entity()
@Index(['continente'])
@Index(['nome'])
export class Pais extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Continente, continente => continente.paises, { nullable: false })
  continente: Continente;

  @OneToMany(() => Estado, estado => estado.pais)
  estados: Estado[];

  @OneToMany(() => Regiao, regiao => regiao.pais)
  regioes: Regiao[];

  @OneToMany(() => Localizacao, localizacao => localizacao.pais)
  localizacoes: Localizacao[];
}