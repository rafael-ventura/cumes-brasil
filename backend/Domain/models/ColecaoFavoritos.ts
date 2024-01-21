// models/ColecaoFavoritos.ts

import {ColecaoBase} from "./ColecaoBase";
import {Via} from "./Via";

export class ColecaoFavoritos extends ColecaoBase {
    viasFavoritas?: Via[]; // Assumindo que você já tem a model Via

    constructor(id: number, nome: string, descricao: string, usuarioId: number, vias: Via[], viasFavoritas?: Via[]) {
        super(id, nome, descricao, usuarioId, vias);
        this.viasFavoritas = viasFavoritas;
    }
}
