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

@Entity()
export class Croqui extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  imagemUrl: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte: Fonte;

  @Column()
  fonte_id: number;

  @ManyToMany(() => Via, via => via.croquis)
  @JoinTable({
    name: "via_croqui",
    joinColumn: {
      name: "croquiId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "viaId",
      referencedColumnName: "id"
    }
  })
  vias: Via[];

}
