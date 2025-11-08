import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Fonte} from "./Fonte";
import {Imagem} from "./Imagem";
import {ViaCroqui} from "./ViaCroqui";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Croqui extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Fonte, fonte => fonte.croquis)
  fonte: number;

  @ManyToOne(() => Imagem, imagem => imagem.croquis, { nullable: true })
  imagem?: Imagem;

  @OneToMany(() => ViaCroqui, viaCroqui => viaCroqui.croqui)
  viaCroquis: ViaCroqui[];
}
