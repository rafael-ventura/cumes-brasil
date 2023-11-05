import {IUsuario} from "../interfaces/IUsuario";
import {Via} from "./Via";
import {ColecaoUsuario} from "./ColecaoDoUsuario";

/**
 * Classe Usuario que implementa a interface IUsuario.
 * Esta classe representa um usuário com suas propriedades e métodos.
 */
export class Usuario implements IUsuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    colecao: ColecaoUsuario;


    constructor(id: number, nome: string, email: string, senha: string, colecao: ColecaoUsuario) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.colecao = colecao;
    }

    // Getters
    public getId(): number {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public getSenha(): string {
        return this.senha;
    }

    // Setters
    public setId(value: number): void {
        this.id = value;
    }

    public setNome(value: string): void {
        this.nome = value;
    }

    public setEmail(value: string): void {
        this.email = value;
    }

    public setSenha(value: string): void {
        this.senha = value;
    }

    public validarCredenciais(email: string, senha: string): boolean {
        return this.email === email && this.senha === senha;
    }


}