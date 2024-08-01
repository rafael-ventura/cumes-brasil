import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Croqui } from './Croqui';
import { Montanha } from './Montanha';
import { Fonte } from './Fonte';
import { Face } from './Face';
import { Imagem } from './Imagem';
import { Escalada } from './Escalada';
import {Colecao} from "./Colecao";

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

  @ManyToOne(() => Montanha, montanha => montanha.vias)
  montanha: number;

  @ManyToOne(() => Via, via => via.variantes)
  viaPrincipal: number;

  @OneToMany(() => Via, via => via.viaPrincipal)
  variantes: Via[];

  @ManyToOne(() => Fonte, fonte => fonte.vias)
  fonte: number;

  @ManyToOne(() => Face, face => face.vias)
  face: number;

  @ManyToOne(() => Imagem, imagem => imagem.vias)
  imagem: number;

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
  colecoes: Colecao[];

  @OneToMany(() => Escalada, escalada => escalada.viaId)
  escaladas: Escalada[];
}
