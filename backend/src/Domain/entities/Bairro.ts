import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cidade } from './Cidade';
import { Montanha } from './Montanha';

@Entity()
export class Bairro extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Cidade, cidade => cidade.bairros)
  cidade: Cidade;

  @OneToMany(() => Montanha, montanha => montanha.bairro)
  montanhas: Montanha[];
}