export interface Localizacao {
  id: number;
  continente?: {
    id: number;
    nome: string;
  };
  pais?: {
    id: number;
    nome: string;
  };
  regiao?: {
    id: number;
    nome: string;
  } | null;
  estado?: {
    id: number;
    nome: string;
    sigla: string;
  };
  cidade?: {
    id: number;
    nome: string;
  };
  bairro?: {
    id: number;
    nome: string;
  } | null;
}

