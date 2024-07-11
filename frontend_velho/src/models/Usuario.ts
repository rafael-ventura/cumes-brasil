// src/models/Usuario.ts

import { Imagem } from "src/models/Imagem";
import { Colecao } from "src/models/Colecao";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  foto_perfil?: Imagem;
  colecoes?: Colecao[];
}
