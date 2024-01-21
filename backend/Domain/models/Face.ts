// models/Face.ts

import {Via} from "./Via";

export class Face {
    id: number;
    nome: string;
    montanhaId: number;
    fonteId?: number;

    constructor(id: number, nome: string, montanhaId: number, fonteId?: number) {
        this.id = id;
        this.nome = nome;
        this.montanhaId = montanhaId;
        this.fonteId = fonteId;
    }
}
