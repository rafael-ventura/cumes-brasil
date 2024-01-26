
import {Via} from "./Via";

export class ColecaoBase {
    id: number;
    nome: string;
    descricao?: string;
    usuario_id?: number;
    vias?: Via[]; // Assumindo que você já tem a model Via

    constructor(id: number, nome: string, descricao?: string, usuarioId?: number) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.usuario_id = usuarioId;
        this.vias = [];
    }

    public adicionarVia(via: Via){
        this.vias?.push(via);
    }

}
