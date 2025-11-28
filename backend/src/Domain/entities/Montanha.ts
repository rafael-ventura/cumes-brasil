import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Imagem } from "./Imagem";
import { Face } from "./Face";
import { Setor } from "./Setor";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
@Index(['nome'])
export class Montanha extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column("int", { nullable: true })
  altura?: number;

  @ManyToOne(() => Imagem)
  imagem: number;


  @OneToMany(() => Face, face => face.montanha)
  faces: Face[];

  @OneToMany(() => Setor, setor => setor.montanha)
  setores: Setor[];
}
