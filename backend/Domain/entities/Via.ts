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
  montanha: Montanha;

  @Column({ nullable: false })
  montanha_id: number;

  @ManyToOne(() => Via, via => via.variantes)
  @JoinColumn({ name: "via_principal_id" })
  viaPrincipal: Via;

  @OneToMany(() => Via, via => via.viaPrincipal)
  variantes: Via[];

  @Column({ nullable: true })
  via_principal_id: number;

  @ManyToOne(() => Fonte, fonte => fonte.vias)
  @JoinColumn({ name: "fonte_id" })
  fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;

  @ManyToOne(() => Face, face => face.vias)
  @JoinColumn({ name: "face_id" })
  face: Face;

  @Column()
  face_id: number;

  @ManyToMany(() => Croqui, croqui => croqui.vias)
  @JoinTable({ name: "via_croqui" })
  croquis: Croqui[];

}
