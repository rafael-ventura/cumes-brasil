import {
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
import { ViaColecao } from './ViaColecao';
import {ViaCroqui} from "./ViaCroqui";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Via extends BaseEntityWithTimestamps {
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

  @OneToMany(() => ViaCroqui, viaCroqui => viaCroqui.via)
  viaCroquis: ViaCroqui[];

  @OneToMany(() => ViaColecao, viaColecao => viaColecao.via)
  viaColecoes: ViaColecao[];

  @OneToMany(() => Escalada, escalada => escalada.via)
  escaladas: Escalada[];
}
