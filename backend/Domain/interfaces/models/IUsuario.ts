import {Via} from "../../entities/Via"
import {ColecaoBase} from "../../entities/ColecaoBase";

export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    fotoPerfil: string;
    colecao: ColecaoBase;
    historico: ColecaoBase;
    favoritos: ColecaoBase;

    getSenha(): string;

    setSenha(novaSenha: string): void;
}