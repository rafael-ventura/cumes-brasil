import { ModalidadeEscalada } from '../../enum/EModalidadeEscalada';

export interface FiltrosBuscaBase {
  termoBusca?: string;
  pagina?: number;
  itensPorPagina?: number;
  campoOrdenacao?: string;
  direcaoOrdenacao?: string;
  usuarioId?: number;
}

export interface FiltrosBuscaVia extends FiltrosBuscaBase {
  montanhaId?: number;
  grau?: string;
  crux?: string;
  exposicao?: string;
  /** D1–D5 (normalizado no repositório) */
  duracao?: string;
  faixaExtensao?: number[];
  tipoRocha?: string;
  tipoEscalada?: string;
  modalidade?: ModalidadeEscalada;
  artificial?: string;
  viaCerj?: boolean;
  semGrau?: boolean;
  semLocalizacao?: boolean;
  nomeBairro?: string;
  paisId?: number;
  estadoId?: number;
  cidadeId?: number;
  bairroId?: number;
  colecaoId?: number;
}

export interface FiltrosBuscaColecao extends FiltrosBuscaBase {
  termoBusca?: string;
  colecaoId?: number;
  nomeVia?: string;
  nomeMontanha?: string;
}

export interface FiltrosBuscaEscalada extends FiltrosBuscaBase {
  termoBusca?: string;
}

export type FiltrosBusca = FiltrosBuscaVia | FiltrosBuscaColecao | FiltrosBuscaEscalada;
