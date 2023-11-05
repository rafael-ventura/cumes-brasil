import {Via} from "../models/Via";
import {ColecaoUsuario} from "../models/ColecaoDoUsuario";

export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    colecao: ColecaoUsuario;

    getId(): number;

    getNome(): string;

    getEmail(): string;

    getSenha(): string;

    setId(value: number): void;

    setNome(value: string): void;

    setEmail(value: string): void;

    setSenha(value: string): void;

    validarCredenciais(email: string, senha: string): boolean;

}