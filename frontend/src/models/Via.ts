import { Imagem } from 'src/models/Imagem';
import { Fonte } from 'src/models/Fonte';
import { Croqui } from 'src/models/Croqui';
import { Localizacao } from 'src/models/Localizacao';

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
  latitude?: number;
  longitude?: number;
  localizacao?: Localizacao;
  via_principal?: Via;
  fonte?: Fonte;
  imagem?: Imagem;
  croquis: Croqui[];
}
