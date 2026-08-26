import { Participante } from './Participante';
import { Imagem } from './Imagem';

/** Resumo do usuário como vem no EscaladaBuscaDTO da API. */
export interface EscaladaUsuarioResumo {
  id: number;
  nome?: string;
  username?: string;
}

/** Resumo da via como vem no EscaladaBuscaDTO da API. */
export interface EscaladaViaResumo {
  id: number;
  nome?: string;
  grau?: string;
  imagem?: Imagem;
}

export interface Escalada {
  // Na criação enviamos ids (number); ao ler do backend vêm objetos resumidos.
  usuario: number | EscaladaUsuarioResumo;
  via: number | EscaladaViaResumo;
  data: Date;
  id?: number;
  observacao?: string;
  participantes: Participante[];
}
