import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Fonte } from './Fonte';
import { Imagem } from './Imagem';
import { Face } from './Face';
import { Via } from './Via';
import { Bairro } from './Bairro';

@Entity()
export class Montanha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column("int", { nullable: true })
  altura?: number;

  @ManyToOne(() => Fonte)
  fonte: number;

  @ManyToOne(() => Imagem)
  imagem: number;

  @ManyToOne(() => Bairro, bairro => bairro.montanhas)
  bairro: Bairro;

  @OneToMany(() => Face, face => face.montanha)
  faces: Face[];

  @OneToMany(() => Via, via => via.montanha)
  vias: Via[];
}
