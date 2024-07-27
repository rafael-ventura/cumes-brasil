import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { Colecao } from "./Colecao";
import { Via } from "./Via";

@Entity("colecao_via")
@Unique(["colecao", "via"])
export class ColecaoVia {
  @PrimaryColumn()
  colecao_id: number;

  @PrimaryColumn()
  via_id: number;

  @ManyToOne(() => Colecao, colecao => colecao.viasColecoes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "colecao_id" })
  colecao: Colecao;

  @ManyToOne(() => Via, via => via.viasColecoes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "via_id" })
  via: Via;

}
