// models/Croqui.ts

import {Via} from "./Via";

export class Croqui {
    id: number;
    nome: string;
    imagemUrl: string;
    autor: string;
    descricao?: string;
    fonteId?: number;


    constructor(id: number, nome: string, imagemUrl: string, autor: string, descricao?: string, fonteId?: number) {
        this.id = id;
        this.nome = nome;
        this.imagemUrl = imagemUrl;
        this.autor = autor;
        this.descricao = descricao;
        this.fonteId = fonteId;
    }
}