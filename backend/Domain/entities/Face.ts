import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Montanha } from "./Montanha";
import { Fonte } from "./Fonte";
import { Via } from "./Via";

@Entity()
export class Face extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Montanha, montanha => montanha.faces)
  montanha: number;

  @ManyToOne(() => Fonte, fonte => fonte.faces)
  fonte: number;

  @OneToMany(() => Via, via => via.face)
  vias: Via[];

}
