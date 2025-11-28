import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Montanha } from "./Montanha";
import { Face } from "./Face";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Setor extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Montanha, montanha => montanha.setores)
  montanha: number;

  @ManyToOne(() => Face, face => face.setores, { nullable: true })
  face: number;
}

