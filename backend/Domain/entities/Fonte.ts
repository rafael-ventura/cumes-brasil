import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";

@Entity()
export class Fonte extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  autor: string;

  @Column({ nullable: false })
  referencia: string;

  @OneToMany(() => Via, via => via.fonte)
  vias: Via[];


}
