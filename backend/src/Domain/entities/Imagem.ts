import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Fonte} from "./Fonte";
import {Colecao} from "./Colecao";
import {ViaImagem} from "./ViaImagem";
import {Montanha} from "./Montanha";
import {Usuario} from "./Usuario";
import {Croqui} from "./Croqui";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";

@Entity()
export class Imagem extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Fonte, fonte => fonte.imagens)
  @JoinColumn({name: "fonte_id"})
  fonte: Fonte;

  @Column({nullable: true})
  fonte_id: number;

  @Column({ nullable: false })
  tipo_entidade: string;

  @OneToMany(() => Colecao, colecao => colecao.imagem)
  colecoes: Colecao[];

  @OneToMany(() => ViaImagem, vi => vi.imagem)
  viaImagens: ViaImagem[];

  @OneToMany(() => Montanha, montanha => montanha.imagem)
  montanhas: Montanha[];

  @OneToMany(() => Usuario, usuario => usuario.foto_perfil)
  usuarios: Usuario[];

  @OneToMany(() => Croqui, croqui => croqui.imagem)
  croquis: Croqui[];
}
