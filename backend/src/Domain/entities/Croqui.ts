import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Via } from "./Via";
import { Fonte } from "./Fonte";
import { Imagem } from "./Imagem";

@Entity()
export class Croqui extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Fonte, fonte => fonte.croquis)
  fonte: number;

  @ManyToOne(() => Imagem, imagem => imagem.croquis)
  imagem: number;

  @ManyToMany(() => Via, via => via.croquis)
  vias: Via[];
}
