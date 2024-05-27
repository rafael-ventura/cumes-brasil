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

  @ManyToOne(() => Colecao, colecao => colecao.viasColecoes)
  @JoinColumn({ name: "colecao_id" })
  colecao: Colecao;

  @ManyToOne(() => Via, via => via.viasColecoes)
  @JoinColumn({ name: "via_id" })
  via: Via;
}
