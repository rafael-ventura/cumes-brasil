import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pais } from './Pais';
import { Estado } from './Estado';

@Entity()
export class Regiao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Pais, pais => pais.regioes)
  pais: Pais;

  @OneToMany(() => Estado, estado => estado.regiao)
  estados: Estado[];
}