// models/Fonte.ts

import {Via} from "./Via";

export class Fonte {
    id: number;
    autor: string;
    referencia: string;

    constructor(id: number, autor: string, referencia: string, vias?: Via[]) {
        this.id = id;
        this.autor = autor;
        this.referencia = referencia;
    }
}
