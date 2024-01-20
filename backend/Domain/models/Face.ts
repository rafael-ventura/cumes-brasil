// models/Face.ts

import {Via} from "./Via";

export class Face {
    id: number;
    nome: string;
    montanhaId: number;
    vias?: Via[]; // Assumindo que você já tem a model Via

    constructor(id: number, nome: string, montanhaId: number, vias?: Via[]) {
        this.id = id;
        this.nome = nome;
        this.montanhaId = montanhaId;
        this.vias = vias;
    }
}
