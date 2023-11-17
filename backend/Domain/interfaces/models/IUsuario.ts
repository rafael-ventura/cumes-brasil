import {Via} from "../../models/Via";
import {ColecaoDoUsuario} from "../../models/ColecaoDoUsuario";
import {ColecaoBase} from "../../models/ColecaoBase";

export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    fotoPerfil: string;
    colecao: ColecaoBase;
    historico: ColecaoDoUsuario;
    favoritos: ColecaoDoUsuario;

    getSenha(): string;

    setSenha(novaSenha: string): void;
}