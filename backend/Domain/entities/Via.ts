import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Croqui } from "./Croqui";
import { Montanha } from "./Montanha";
import { Fonte } from "./Fonte";
import { Face } from "./Face";
import { Colecao } from "./Colecao";
import { Imagem } from "./Imagem";

@Entity()
export class Via extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  grau: string;

  @Column({ nullable: true })
  crux: string;

  @Column({ nullable: true })
  artificial: string;

  @Column({ nullable: true })
  duracao: string;

  @Column({ nullable: true })
  exposicao: string;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true
  })
  extensao: number;

  @Column({
    type: "varchar",
    nullable: true
  })
  conquistadores: string;

  @Column({ nullable: true })
  detalhes: string;

  @Column({ nullable: true })
  data: string;

  @ManyToOne(() => Montanha)
  @JoinColumn({ name: "montanha_id" })
  montanha_id: number;

  @ManyToOne(() => Via)
  @JoinColumn({ name: "via_principal_id" })
  via_principal_id: number;

  @OneToMany(() => Via, via => via.via_principal_id)
  variantes: Via[];

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte_id: number;

  @ManyToOne(() => Face)
  @JoinColumn({ name: "face_id" })
  face_id: number;

  @ManyToOne(() => Imagem)
  @JoinColumn({ name: "imagem_id" })
  imagem_id: number;

  @ManyToMany(() => Croqui, croqui => croqui.vias)
  @JoinTable({
    name: "via_croqui",
    joinColumn: {
      name: "via_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "croqui_id",
      referencedColumnName: "id"
    }
  })
  croquis: Croqui[];

  @ManyToMany(() => Colecao, colecao => colecao.vias)
  @JoinTable({
    name: "colecao_via",
    joinColumn: {
      name: "via_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "colecao_id",
      referencedColumnName: "id"
    }
  })
  colecoes: Colecao[];
}
