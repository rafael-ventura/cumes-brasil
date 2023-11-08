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
    public id: number;
    public nome: string;
    public email: string;
    public senha: string;
    public colecao: ColecaoBase;
    public historico: ColecaoEscaladas;
    public favoritos: ColecaoFavoritos;

    constructor(
        id: number,
        nome: string,
        email: string,
        senha: string,
        colecao: ColecaoBase,
        historico: ColecaoEscaladas,
        favoritos: ColecaoFavoritos
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.colecao = colecao;
        this.historico = historico;
        this.favoritos = favoritos;
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