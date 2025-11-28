import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";
import { Continente } from "./Continente";
import { Pais } from "./Pais";
import { Regiao } from "./Regiao";
import { Estado } from "./Estado";
import { Cidade } from "./Cidade";
import { Bairro } from "./Bairro";
import { Via } from "./Via";

@Entity()
@Index(['cidade'])
@Index(['estado'])
@Index(['bairro'])
@Index(['pais'])
@Index(['regiao'])
export class Localizacao extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Continente, continente => continente.localizacoes, { nullable: false })
  continente: Continente;

  @ManyToOne(() => Pais, pais => pais.localizacoes, { nullable: false })
  pais: Pais;

  @ManyToOne(() => Regiao, regiao => regiao.localizacoes, { nullable: true })
  regiao: Regiao;

  @ManyToOne(() => Estado, estado => estado.localizacoes, { nullable: false })
  estado: Estado;

  @ManyToOne(() => Cidade, cidade => cidade.localizacoes, { nullable: false })
  cidade: Cidade;

  @ManyToOne(() => Bairro, bairro => bairro.localizacoes, { nullable: true })
  bairro: Bairro;

  @OneToMany(() => Via, via => via.localizacao)
  vias: Via[];
}

