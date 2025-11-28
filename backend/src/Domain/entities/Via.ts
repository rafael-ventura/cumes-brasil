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
import { Localizacao } from './Localizacao';
import { Escalada } from './Escalada';
import { ViaColecao } from './ViaColecao';
import {ViaCroqui} from "./ViaCroqui";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
@Index(['localizacao'])
@Index(['nome'])
@Index(['grau'])
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

  @ManyToOne(() => Via, via => via.variantes)
  viaPrincipal: number;

  @OneToMany(() => Via, via => via.viaPrincipal)
  variantes: Via[];

  @ManyToOne(() => Fonte, fonte => fonte.vias)
  fonte: number;

  @ManyToOne(() => Imagem, imagem => imagem.vias)
  imagem: number;

  @ManyToOne(() => Localizacao, localizacao => localizacao.vias, { nullable: false })
  localizacao: Localizacao;

  @OneToMany(() => ViaCroqui, viaCroqui => viaCroqui.via)
  viaCroquis: ViaCroqui[];

  @OneToMany(() => ViaColecao, viaColecao => viaColecao.via)
  viaColecoes: ViaColecao[];

  @OneToMany(() => Escalada, escalada => escalada.via)
  escaladas: Escalada[];
}
