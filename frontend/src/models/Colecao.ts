import { Via } from 'src/models/Via';
import { Imagem } from 'src/models/Imagem';
import { Usuario } from 'src/models/Usuario';

export interface Colecao {
  id: number;
  nome: string;
  descricao?: string;
  usuario: Usuario;
  imagem: Imagem;
  vias?: Via[] | null;
}
