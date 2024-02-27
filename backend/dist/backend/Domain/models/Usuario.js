"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
/*import {ColecaoBase} from "./Colecao";
import {ColecaoFavoritos} from "./ColecaoFavoritos";
import {ColecaoEscaladas} from "./Escalada";
*/
class Usuario {
    constructor(id, nome, email, fotoPerfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.fotoPerfil = fotoPerfil;
    }
    /*
    // Métodos adicionais
    public addColecaoPersonalizada(colecao: ColecaoBase) {
        this.colecoesPersonalizadas.push(colecao);
    }

    public addColecaoFavoritos(colecao: ColecaoFavoritos) {
        this.colecoesFavoritos.push(colecao);
    }

    public addColecaoEscaladas(colecao: ColecaoEscaladas) {
        this.colecoesEscaladas.push(colecao);
    }

    public removerColecaoPersonalizada(colecaoId: number) {
        this.colecoesPersonalizadas = this.colecoesPersonalizadas.filter(c => c.id !== colecaoId);
    }

    public removerColecaoFavoritos(colecaoId: number) {
        this.colecoesFavoritos = this.colecoesFavoritos.filter(c => c.id !== colecaoId);
    }

    public removerColecaoEscaladas(colecaoId: number) {
        this.colecoesEscaladas = this.colecoesEscaladas.filter(c => c.id !== colecaoId);
    }
    */
    atualizarFotoPerfil(novaFoto) {
        this.fotoPerfil = novaFoto;
    }
    atualizarEmail(novoEmail) {
        this.email = novoEmail;
    }
}
exports.Usuario = Usuario;
