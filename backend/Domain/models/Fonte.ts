// models/Fonte.ts

import {Via} from "./Via";

export class Fonte {
    id: number;
    referencia: string;
    vias?: Via[]; // Assumindo que você já tem a model Via

    constructor(id: number, referencia: string, vias?: Via[]) {
        this.id = id;
        this.referencia = referencia;
        this.vias = vias;
    }
}
