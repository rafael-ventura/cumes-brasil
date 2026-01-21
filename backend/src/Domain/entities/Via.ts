import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Croqui } from './Croqui';
import { Fonte } from './Fonte';
import { Imagem } from './Imagem';
import { Montanha } from './Montanha';
import { Face } from './Face';
import { Setor } from './Setor';
import { Escalada } from './Escalada';
import { ViaColecao } from './ViaColecao';
import {ViaCroqui} from "./ViaCroqui";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";
import { ModalidadeEscalada } from '../enum/EModalidadeEscalada';

@Entity()
@Index(['montanha'])
@Index(['face'])
@Index(['setor'])
@Index(['nome'])
@Index(['grau'])
@Index(['tipo_rocha'])
@Index(['tipo_escalada'])
@Index(['modalidade'])
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

  @Column({
    type: "decimal",
    precision: 10,
    scale: 7,
    nullable: true
  })
  latitude: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 7,
    nullable: true
  })
  longitude: number;

  @Column({ nullable: true })
  tipo_rocha: string;

  @Column({ nullable: true })
  tipo_escalada: string;

  @Column({
    type: "enum",
    enum: ModalidadeEscalada,
    nullable: true
  })
  modalidade: ModalidadeEscalada;

  @ManyToOne(() => Via, via => via.variantes)
  viaPrincipal: number;

  @OneToMany(() => Via, via => via.viaPrincipal)
  variantes: Via[];

  @ManyToOne(() => Fonte, fonte => fonte.vias)
  fonte: number;

  @ManyToOne(() => Imagem, imagem => imagem.vias)
  imagem: number;

  @ManyToOne(() => Montanha, { nullable: true })
  montanha: Montanha;

  @ManyToOne(() => Face, { nullable: true })
  face: Face;

  @ManyToOne(() => Setor, { nullable: true })
  setor: Setor;

  @OneToMany(() => ViaCroqui, viaCroqui => viaCroqui.via)
  viaCroquis: ViaCroqui[];

  @OneToMany(() => ViaColecao, viaColecao => viaColecao.via)
  viaColecoes: ViaColecao[];

  @OneToMany(() => Escalada, escalada => escalada.via)
  escaladas: Escalada[];
}
