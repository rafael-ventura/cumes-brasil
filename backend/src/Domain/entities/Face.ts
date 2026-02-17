import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable, Index} from "typeorm";
import {Montanha} from "./Montanha";
import {Fonte} from "./Fonte";
import {Setor} from "./Setor";
import {Via} from "./Via";
import {Localizacao} from "./Localizacao";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
@Index(['montanha'])
@Index(['fonte'])
@Index(['nome'])
export class Face extends BaseEntityWithTimestamps {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    nome: string;

  @Column({nullable: true})
  fantasia: string;

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

  @ManyToOne(() => Montanha, montanha => montanha.faces)
  montanha: Montanha;
  
  @ManyToOne(() => Fonte, fonte => fonte.faces)
  fonte: Fonte;

  @OneToMany(() => Setor, setor => setor.face)
  setores: Setor[];

  @OneToMany(() => Via, via => via.face)
  vias: Via[];

  @ManyToMany(() => Localizacao, localizacao => localizacao.faces)
  @JoinTable({ name: "face_localizacoes" })
  localizacoes: Localizacao[];
}
