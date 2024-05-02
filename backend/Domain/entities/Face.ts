import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Montanha } from "./Montanha";
import { Fonte } from "./Fonte";

@Entity()
export class Face extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @ManyToOne(() => Montanha)
  montanha: Montanha;

  @ManyToOne(() => Fonte)
  fonte: Fonte;

  @OneToMany(() => Via, via => via.face_id)
  vias: Via[];
}
