import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Montanha } from "./Montanha";
import { Fonte } from "./Fonte";
import { Via } from "./Via";

@Entity()
export class Face extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Montanha)
  Montanha: Montanha;

  @Column({ nullable: false })
  montanha_id: number;

  @ManyToOne(() => Fonte)
  Fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;

  @OneToMany(() => Via, via => via.face)
  vias: Via[];

}
