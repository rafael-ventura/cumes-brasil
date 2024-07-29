import { Via } from 'src/models/Via';
import { Imagem } from 'src/models/Imagem';

export interface Colecao {
  id: number;
  nome: string;
  descricao?: string;
  usuario_id: number;
  imagem: Imagem;
  vias?: Via[];
}
