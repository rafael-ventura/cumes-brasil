import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Imagem } from "./Imagem";
import { Face } from "./Face";
import { Setor } from "./Setor";
import { Via } from "./Via";
import { Localizacao } from "./Localizacao";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
@Index(['nome'])
@Index(['imagem'])
export class Montanha extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column("int", { nullable: true })
  altura?: number;

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

  @ManyToOne(() => Imagem)
  imagem: Imagem;

  @OneToMany(() => Face, face => face.montanha)
  faces: Face[];

  @OneToMany(() => Setor, setor => setor.montanha)
  setores: Setor[];

  @OneToMany(() => Via, via => via.montanha)
  vias: Via[];

  @ManyToMany(() => Localizacao, localizacao => localizacao.montanhas)
  @JoinTable({ name: "montanha_localizacoes" })
  localizacoes: Localizacao[];
}
