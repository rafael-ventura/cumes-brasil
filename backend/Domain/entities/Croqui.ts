import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;

  @ManyToOne(() => Imagem)
  imagem: Imagem;

  @Column({ nullable: false })
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
