import { ModalidadeEscalada } from './ModalidadeEscalada';

export interface BuscaRequest {
  tipoEntidade?: string;
  termoBusca?: string;
  montanhaId?: number | null;
  nomeBairro?: string | null;
  paisId?: number | null;
  estadoId?: number | null;
  cidadeId?: number | null;
  bairroId?: number | null;
  grau?: string | null;
  faixaExtensao?: number[] | null;
  crux?: string | null;
  exposicao?: string | null;
  duracao?: string | null;
  tipoRocha?: string | null;
  tipoEscalada?: string | null;
  modalidade?: ModalidadeEscalada | null;
  artificial?: string | null;
  viaCerj?: boolean | null;
  comCroqui?: boolean | null;
  comoPerfil?: 'autor' | 'marcado' | 'todas' | null;
  semGrau?: boolean | null;
  semLocalizacao?: boolean | null;
  pagina: number;
  itensPorPagina?: number;
  colecaoId?: number;
  campoOrdenacao?: string | null;
  direcaoOrdenacao?: string | null;
}
