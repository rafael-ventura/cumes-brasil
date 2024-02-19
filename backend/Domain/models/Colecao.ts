import { Via } from "./Via";

export class Colecao {
  id: number;
  nome: string;
  usuario_id: number;
  descricao?: string | undefined;
  vias?: Via[] | undefined;

  constructor(
    id: number,
    nome: string,
    usuarioId: number,
    descricao?: string,
    vias?: Via[]
  ) {
    this.id = id;
    this.nome = nome;
    this.usuario_id = usuarioId;
    this.descricao = descricao;
    this.vias = vias || [];
  }

  public popularVia(via: Via): void {
    this.vias?.push(via);
  }
}
