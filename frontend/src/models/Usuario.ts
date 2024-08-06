// src/models/Usuario.ts

import { Imagem } from 'src/models/Imagem';
import { Colecao } from 'src/models/Colecao';
import { Via } from 'src/models/Via';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  data_atividade?: string | null; // Formato dd/mm/aaaa
  clube_organizacao?: string | null;
  localizacao?: string | null;
  biografia?: string | null;
  via_preferida?: Via | null;
  foto_perfil?: Imagem | null;
  colecoes?: Colecao[] | null;
}
