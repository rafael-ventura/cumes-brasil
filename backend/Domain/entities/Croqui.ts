import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";

@Entity()
export class Croqui extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  imagemUrl: string;

  @Column()
  autor: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToMany(() => Via, via => via.croquis)
  vias: Via[];
}
