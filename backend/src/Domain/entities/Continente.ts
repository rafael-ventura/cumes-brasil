import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pais } from './Pais';
import { Localizacao } from './Localizacao';

@Entity()
export class Continente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @OneToMany(() => Pais, pais => pais.continente)
  paises: Pais[];

  @OneToMany(() => Localizacao, localizacao => localizacao.continente)
  localizacoes: Localizacao[];
}

