import { Colecao, IColecao } from 'src/models/IColecao';

import { Via } from 'src/models/Via';
import { Imagem } from 'src/models/Imagem';

// Interface que define a estrutura de Usuario
export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  data_atividade?: string | null; // Data opcional
  clube_organizacao?: string | null;
  localizacao?: string | null;
  biografia?: string | null;
  via_preferida?: Via | null;
  foto_perfil: Imagem;
  colecoes?: Colecao[] | null;
}

// Classe que implementa a interface IUsuario
export class Usuario implements IUsuario {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  data_atividade?: string | null;
  clube_organizacao?: string | null;
  localizacao?: string | null;
  biografia?: string | null;
  via_preferida?: Via | null;
  foto_perfil: Imagem;
  colecoes?: IColecao[] | null;

  constructor (id = 0) {
    this.id = id;
    this.nome = '';
    this.email = '';
    this.password_hash = '';
    this.data_atividade = null;
    this.clube_organizacao = null;
    this.localizacao = null;
    this.biografia = null;
    this.via_preferida = null;
    this.foto_perfil = new Imagem();
    this.colecoes = null;
  }
}
