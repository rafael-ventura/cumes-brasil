export type ConquistaTier = 'NENHUM' | 'BRONZE' | 'PRATA' | 'OURO' | 'PLATINA';

export type ConquistaBadge = {
  tier: ConquistaTier;
  icone: string;
  label: string;
  cor: string;
};

export type ProgressoConquista = {
  atual: number;
  proximo: number | null;
};

export type ConquistaPorTipo = {
  id: string;
  tipo: string;
  titulo: string;
  descricao?: string;
  iconeTipo: string;
  badge: ConquistaBadge;
  progresso: ProgressoConquista;
  valorAtual: number;
};

export type ConquistasResposta = {
  conquistas: ConquistaPorTipo[];
};

