import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Fonte } from "./Fonte";

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

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte: Fonte;

  @Column()
  fonte_id: number;

  @ManyToMany(() => Via, via => via.croquis)
  vias: Via[];

}
