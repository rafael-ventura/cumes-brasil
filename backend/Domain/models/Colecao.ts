import { Via } from "./Via";

export class Colecao {
    id: number;
    nome: string;
    descricao?: string | undefined;
    usuario_id?: number;
    vias?: Via[] | undefined;

    constructor(id: number, nome: string, descricao?: string, usuarioId?: number, vias?: Via[]) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.usuario_id = usuarioId;
        this.vias = vias || [];
    }

    public adicionarVia(via: Via): void {
        this.vias?.push(via);
    }
}
