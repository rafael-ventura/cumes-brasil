// models/Usuario.ts

import {ColecaoBase} from "./ColecaoBase";

export class Usuario {
    id: number;
    nome: string;
    email: string;
    fotoPerfil?: string;
    colecoesPersonalizadas?: ColecaoBase[]; // Assumindo que você terá uma model para ColecaoBase

    constructor(id: number, nome: string, email: string, fotoPerfil?: string, colecoesPersonalizadas?: ColecaoBase[]) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.fotoPerfil = fotoPerfil;
        this.colecoesPersonalizadas = colecoesPersonalizadas;
    }
}
