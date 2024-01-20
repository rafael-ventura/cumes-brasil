// models/Croqui.ts

import {Via} from "./Via";

export class Croqui {
    id: number;
    imagemUrl: string;
    autor: string;
    descricao?: string;
    vias?: Via[]; // Assumindo que você já tem a model Via

    constructor(id: number, imagemUrl: string, autor: string, descricao?: string, vias?: Via[]) {
        this.id = id;
        this.imagemUrl = imagemUrl;
        this.autor = autor;
        this.descricao = descricao;
        this.vias = vias;
    }
}
