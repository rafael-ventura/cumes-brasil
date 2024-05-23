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
  montanha: {
    id: number;
    nome: string;
  };
  face: {
    id: number;
    nome: string;
  };
  fonte: {
    id: number;
    autor: string;
  };
}
