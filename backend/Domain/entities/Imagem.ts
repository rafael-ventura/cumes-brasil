import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Fonte } from "./Fonte";
import { Colecao } from "./Colecao";
import { Via } from "./Via";
import { Montanha } from "./Montanha";
import { Usuario } from "./Usuario";

@Entity()
export class Imagem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Fonte)
  Fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;

  @Column({ nullable: false })
  tipo_entidade: string;

  @OneToMany(() => Colecao, colecao => colecao.imagem)
  colecoes: Colecao[];

  @OneToMany(() => Via, via => via.imagem)
  vias: Via[];

  @OneToMany(() => Montanha, montanha => montanha.Imagem)
  montanhas: Montanha[];

  @OneToMany(() => Usuario, usuario => usuario.Imagem)
  usuarios: Usuario[];
}
