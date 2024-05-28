import { Fonte } from "src/models/Fonte";
import { Imagem } from "src/models/Imagem";

export interface Croqui {
  id: number;
  nome: string;
  fonte: Fonte;
  imagem: Imagem;
}
