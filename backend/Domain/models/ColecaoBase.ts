
import {Via} from "./Via";

export class ColecaoBase {
    id: number;
    nome: string;
    descricao?: string;
    usuarioId?: number;
    vias?: Via[]; // Assumindo que você já tem a model Via

    constructor(id: number, nome: string, descricao?: string, usuarioId?: number, vias?: Via[]) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.usuarioId = usuarioId;
        this.vias = vias;
    }
}
