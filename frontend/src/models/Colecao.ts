import { Via } from "src/models/Via";

export interface Colecao {
  id: number;
  nome: string;
  descricao: string;
  vias: Via[];
}
