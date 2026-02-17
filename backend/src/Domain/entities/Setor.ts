import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable, Index } from "typeorm";
import { Montanha } from "./Montanha";
import { Face } from "./Face";
import { Via } from "./Via";
import { Localizacao } from "./Localizacao";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
@Index(['montanha'])
@Index(['face'])
@Index(['nome'])
export class Setor extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 7,
    nullable: true
  })
  latitude: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 7,
    nullable: true
  })
  longitude: number;

  @ManyToOne(() => Montanha, montanha => montanha.setores)
  montanha: Montanha;

  @ManyToOne(() => Face, face => face.setores, { nullable: true })
  face: Face;

  @OneToMany(() => Via, via => via.setor)
  vias: Via[];

  @ManyToMany(() => Localizacao, localizacao => localizacao.setores)
  @JoinTable({ name: "setor_localizacoes" })
  localizacoes: Localizacao[];
}

