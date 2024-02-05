import {Via} from "./Via";

export class Escalada {
    id: number;
    nome: string;
    data: Date | undefined;
    via: Via;
    descricao?: string | undefined;
    usuarioId: number;

    constructor(id: number, nome: string, data: Date | undefined, via: Via, usuarioId: number, descricao?: string | undefined) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.via = via;
        this.usuarioId = usuarioId;
        this.descricao = descricao;
    }
}