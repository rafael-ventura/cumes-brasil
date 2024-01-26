import {ColecaoBase} from "./ColecaoBase";

export class ColecaoEscaladas extends ColecaoBase {
    via_id: number;
    data: Date | undefined;
    observacao: string | undefined;

    constructor(id: number, nome: string, descricao: string, usuarioId: number, viaId: number, data: Date | undefined, observacao: string | undefined) {
        super(id, nome, descricao, usuarioId);
        this.via_id = viaId;
        this.data = data;
        this.observacao = observacao;
    }
}
