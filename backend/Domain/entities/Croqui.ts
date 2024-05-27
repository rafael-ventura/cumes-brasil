import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Via } from "./Via";
import { Fonte } from "./Fonte";
import { Imagem } from "./Imagem";

@Entity()
export class Croqui extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte_id: number;

  @ManyToOne(() => Imagem)
  @JoinColumn({ name: "imagem_id" })
  imagem_id: number;

  @ManyToMany(() => Via, via => via.croquis)
  @JoinTable({
    name: "via_croqui",
    joinColumn: {
      name: "croqui_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "via_id",
      referencedColumnName: "id"
    }
  })
  vias: Via[];
}
