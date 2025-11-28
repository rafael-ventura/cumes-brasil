import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Regiao } from './Regiao';
import { Pais } from './Pais';
import { Cidade } from './Cidade';
import { Localizacao } from './Localizacao';

@Entity()
@Index(['pais'])
@Index(['regiao'])
@Index(['sigla'])
export class Estado extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  sigla: string;

  @ManyToOne(() => Regiao, regiao => regiao.estados, { nullable: true })
  regiao: Regiao;

  @ManyToOne(() => Pais, pais => pais.estados, { nullable: false })
  pais: Pais;

  @OneToMany(() => Cidade, cidade => cidade.estado)
  cidades: Cidade[];

  @OneToMany(() => Localizacao, localizacao => localizacao.estado)
  localizacoes: Localizacao[];
}