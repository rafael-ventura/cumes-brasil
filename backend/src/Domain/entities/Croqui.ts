import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Fonte} from "./Fonte";
import {Imagem} from "./Imagem";
import {ViaCroqui} from "./ViaCroqui";

@Entity()
export class Croqui extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Fonte, fonte => fonte.croquis)
  fonte: number;

  @ManyToOne(() => Imagem, imagem => imagem.croquis)
  imagem: number;

  @OneToMany(() => ViaCroqui, viaCroqui => viaCroqui.croqui)
  viaCroquis: ViaCroqui[];
}
