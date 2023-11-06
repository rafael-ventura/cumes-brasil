import {Via} from "../models/Via";
import {ColecaoDoUsuario} from "../models/ColecaoDoUsuario";
import {ColecaoBase} from "../models/ColecaoBase";

export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    colecao: ColecaoBase;

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