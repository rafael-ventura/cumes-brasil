import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Regiao } from './Regiao';
import { Cidade } from './Cidade';

@Entity()
export class Estado extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  sigla: string;

  @ManyToOne(() => Regiao, regiao => regiao.estados)
  regiao: Regiao;

  @OneToMany(() => Cidade, cidade => cidade.estado)
  cidades: Cidade[];
}