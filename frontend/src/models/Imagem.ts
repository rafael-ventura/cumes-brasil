import { Fonte } from "src/models/Fonte";

export interface Imagem {
  id: number;
  url: string;
  descricao?: string;
  fonte: Fonte;
  tipo_entidade: string;
}
