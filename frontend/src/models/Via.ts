import { Montanha } from 'src/models/Montanha';
import { Imagem } from 'src/models/Imagem';
import { Face } from 'src/models/Face';
import { Fonte } from 'src/models/Fonte';
import { Croqui } from 'src/models/Croqui';

export interface Via {
  id: number;
  nome: string;
  grau?: string;
  crux?: string;
  artificial?: string;
  duracao?: string;
  exposicao?: string;
  extensao?: number;
  conquistadores?: string;
  detalhes?: string;
  data?: string;
  montanha: Montanha;
  via_principal?: Via;
  fonte: Fonte;
  face: Face;
  imagem?: Imagem;
  croquis: Croqui[];
}
