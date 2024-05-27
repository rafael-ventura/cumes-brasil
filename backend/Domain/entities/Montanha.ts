import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Fonte } from "./Fonte";
import { Imagem } from "./Imagem";
import { Face } from "./Face";

@Entity()
export class Montanha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: true })
  bairro?: string;

  @Column("int", { nullable: true })
  altura?: number;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte_id: number;

  @ManyToOne(() => Imagem)
  @JoinColumn({ name: "imagem_id" })
  imagem_id: number;

  @OneToMany(() => Face, face => face.montanha_id)
  faces: Face[];
}
