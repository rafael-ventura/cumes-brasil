import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Regiao } from './Regiao';

@Entity()
export class Pais extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @OneToMany(() => Regiao, regiao => regiao.pais)
  regioes: Regiao[];
}