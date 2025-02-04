import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Estado } from './Estado';
import { Bairro } from './Bairro';

@Entity()
export class Cidade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Estado, estado => estado.cidades)
  estado: Estado;

  @OneToMany(() => Bairro, bairro => bairro.cidade)
  bairros: Bairro[];
}