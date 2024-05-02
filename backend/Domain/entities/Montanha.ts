import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Fonte } from './Fonte';

@Entity()
export class Montanha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  localizacao: string;

  @Column('int')
  altura: number;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: 'fonte_id' })
  fonte_id: number;
}
