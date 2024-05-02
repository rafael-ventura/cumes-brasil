import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Montanha } from "./Montanha";
import { Fonte } from "./Fonte";
import { Via } from "./Via";

@Entity()
export class Face extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @ManyToOne(() => Montanha)
  @JoinColumn({ name: "montanha_id" })
  montanha: Montanha;

  @Column()
  montanha_id: number;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte: Fonte;

  @Column()
  fonte_id: number;

  @OneToMany(() => Via, via => via.face)
  vias: Via[];
}
