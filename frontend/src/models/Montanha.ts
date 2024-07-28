import { Imagem } from 'src/models/Imagem';
import { Face } from 'src/models/Face';
import { Fonte } from 'src/models/Fonte';

export interface Montanha {
  fonte: Fonte;
  imagem: Imagem;
  altura?: number;
  bairro?: string;
  faces: Face[];
  id: number;
  nome: string;
}
