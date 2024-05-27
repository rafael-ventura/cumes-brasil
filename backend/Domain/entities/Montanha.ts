import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  bairro: string;

  @Column("int", { nullable: true })
  altura: number;

  @ManyToOne(() => Fonte)
  Fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;

  @ManyToOne(() => Imagem)
  Imagem: Imagem;

  @Column({ nullable: true })
  imagem_id: number;

  @OneToMany(() => Face, face => face.Montanha)
  faces: Face[];
}
