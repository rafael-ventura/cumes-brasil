import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Fonte } from "./Fonte";
import { Colecao } from "./Colecao";
import { Via } from "./Via";
import { Montanha } from "./Montanha";
import { Usuario } from "./Usuario";
import { Croqui } from "./Croqui";

@Entity()
export class Imagem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte_id: number;

  @Column({ nullable: false })
  tipo_entidade: string;

  @OneToMany(() => Colecao, colecao => colecao.imagem_id)
  colecoes: Colecao[];

  @OneToMany(() => Via, via => via.imagem_id)
  vias: Via[];

  @OneToMany(() => Montanha, montanha => montanha.imagem_id)
  montanhas: Montanha[];

  @OneToMany(() => Usuario, usuario => usuario.foto_perfil)
  usuarios: Usuario[];

  @OneToMany(() => Croqui, croqui => croqui.imagem_id)
  croquis: Croqui[];
}
