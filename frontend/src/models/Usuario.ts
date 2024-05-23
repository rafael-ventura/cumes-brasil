// src/models/Usuario.ts

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  fotoPerfil?: string;
}
