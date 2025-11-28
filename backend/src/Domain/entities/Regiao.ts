import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pais } from './Pais';
import { Estado } from './Estado';
import { Localizacao } from './Localizacao';

@Entity()
@Index(['pais'])
@Index(['nome'])
export class Regiao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Pais, pais => pais.regioes, { nullable: false })
  pais: Pais;

  @OneToMany(() => Estado, estado => estado.regiao)
  estados: Estado[];

  @OneToMany(() => Localizacao, localizacao => localizacao.regiao)
  localizacoes: Localizacao[];
}