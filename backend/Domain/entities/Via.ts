import {
  BaseEntity,
  Column,
  Entity,
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
  montanha: Montanha;

  @Column({ nullable: false })
  montanha_id: number;

  @ManyToOne(() => Via)
  viaPrincipal: Via;

  @Column({ nullable: true })
  via_principal_id: number;

  @OneToMany(() => Via, via => via.viaPrincipal)
  variantes: Via[];

  @ManyToOne(() => Fonte)
  fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;

  @ManyToOne(() => Face)
  face: Face;

  @Column({ nullable: false })
  face_id: number;

  @ManyToOne(() => Imagem)
  imagem: Imagem;

  @Column({ nullable: true })
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
