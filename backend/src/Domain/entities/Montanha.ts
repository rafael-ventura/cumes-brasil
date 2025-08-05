import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Fonte } from "./Fonte";
import { Imagem } from "./Imagem";
import { Face } from "./Face";
import { Via } from "./Via";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Montanha extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: true })
  bairro?: string;

  @Column("int", { nullable: true })
  altura?: number;

  @ManyToOne(() => Fonte)
  fonte: number;

  @ManyToOne(() => Imagem)
  imagem: number;

  @OneToMany(() => Face, face => face.montanha)
  faces: Face[];

  @OneToMany(() => Via, via => via.montanha)
  vias: Via[];
}
