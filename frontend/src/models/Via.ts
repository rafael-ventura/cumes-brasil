import { Imagem } from 'src/models/Imagem';
import { Fonte } from 'src/models/Fonte';
import { Croqui } from 'src/models/Croqui';
import { Localizacao } from 'src/models/Localizacao';
import { ModalidadeEscalada } from 'src/models/ModalidadeEscalada';

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
  historia_resumo?: string;
  via_cerj?: boolean;
  equipamentos?: string;
  tracklog_aproximacao?: string;
  data?: string;
  tipo_rocha?: string;
  tipo_escalada?: string;
  modalidade?: ModalidadeEscalada;
  latitude?: number;
  longitude?: number;
  localizacao?: Localizacao; // Obtida através de setor/face/montanha (prioridade: setor > face > montanha)
  montanha?: {
    id: number;
    nome: string;
    altura?: number;
    latitude?: number;
    longitude?: number;
    localizacoes?: Localizacao[];
  };
  face?: {
    id: number;
    nome: string;
    fantasia?: string;
    latitude?: number;
    longitude?: number;
    montanha?: {
      id: number;
      nome: string;
      altura?: number;
      latitude?: number;
      longitude?: number;
      localizacoes?: Localizacao[];
    };
    localizacoes?: Localizacao[];
  };
  setor?: {
    id: number;
    nome: string;
    latitude?: number;
    longitude?: number;
    face?: {
      id: number;
      nome: string;
      fantasia?: string;
      latitude?: number;
      longitude?: number;
      montanha?: {
        id: number;
        nome: string;
        altura?: number;
        latitude?: number;
        longitude?: number;
        localizacoes?: Localizacao[];
      };
      localizacoes?: Localizacao[];
    };
    montanha?: {
      id: number;
      nome: string;
      altura?: number;
      latitude?: number;
      longitude?: number;
      localizacoes?: Localizacao[];
    };
    localizacoes?: Localizacao[];
  };
  via_principal?: Via;
  fonte?: Fonte;
  imagem?: Imagem;
  imagens?: Imagem[];
  croquis: Croqui[];
}
