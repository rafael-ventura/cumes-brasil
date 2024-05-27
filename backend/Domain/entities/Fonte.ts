import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";
import { Croqui } from "./Croqui";
import { Imagem } from "./Imagem";
import { Montanha } from "./Montanha";
import { Face } from "./Face";

@Entity()
export class Fonte extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  autor: string;

  @Column({ nullable: false })
  referencia: string;

  @OneToMany(() => Via, via => via.fonte_id)
  vias: Via[];

  @OneToMany(() => Croqui, croqui => croqui.fonte_id)
  croquis: Croqui[];

  @OneToMany(() => Montanha, montanha => montanha.fonte_id)
  montanhas: Montanha[];

  @OneToMany(() => Face, face => face.fonte_id)
  faces: Face[];

  @OneToMany(() => Imagem, imagem => imagem.fonte_id)
  imagens: Imagem[];

  constructor (id: number, autor: string, referencia: string) {
    super();
    this.id = id;
    this.autor = autor;
    this.referencia = referencia;
  }


}
