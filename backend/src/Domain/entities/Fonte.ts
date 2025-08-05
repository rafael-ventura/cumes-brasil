import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Croqui } from "./Croqui";
import { Imagem } from "./Imagem";
import { Montanha } from "./Montanha";
import { Face } from "./Face";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Fonte extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  autor: string;

  @Column({ nullable: false })
  referencia: string;

  @OneToMany(() => Via, via => via.fonte)
  vias: Via[];

  @OneToMany(() => Croqui, croqui => croqui.fonte)
  croquis: Croqui[];

  @OneToMany(() => Montanha, montanha => montanha.fonte)
  montanhas: Montanha[];

  @OneToMany(() => Face, face => face.fonte)
  faces: Face[];

  @OneToMany(() => Imagem, imagem => imagem.fonte)
  imagens: Imagem[];

  constructor (id: number, autor: string, referencia: string) {
    super();
    this.id = id;
    this.autor = autor;
    this.referencia = referencia;
  }

}
