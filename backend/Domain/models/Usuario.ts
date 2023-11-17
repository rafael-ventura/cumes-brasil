import {IUsuario} from "../interfaces/models/IUsuario";
import {Via} from "./Via";
import {ColecaoBase} from "./ColecaoBase";
import {ColecaoEscaladas} from "./ColecaoEscaladas";
import {ColecaoFavoritos} from "./ColecaoFavoritos";

/**
 * Classe Usuario que implementa a interface IUsuario.
 * Esta classe representa um usuário com suas propriedades e métodos.
 */
export class Usuario implements IUsuario {
    private _senha: string;

    constructor(
        public id: number,
        public nome: string,
        public email: string,
        senha: string,
        public fotoPerfil: string,
        public colecao: ColecaoBase,
        public historico: ColecaoEscaladas = new ColecaoEscaladas(),
        public favoritos: ColecaoFavoritos = new ColecaoFavoritos()
    ) {
        this._senha = senha;
    }

    // Getters e Setters
    getSenha(): string {
        return this._senha;
    }

    setSenha(novaSenha: string) {
        // Aqui você pode adicionar lógica de validação para a senha
    }

}