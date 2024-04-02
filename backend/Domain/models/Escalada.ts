
export class Escalada {
    id: number;
    nome: string | undefined;
    data?: Date;
    observacao: string | undefined;
    usuario_id: number;
    via_id: number;

    constructor(id: number, nome: string | undefined, data: Date | undefined, observacao: string | undefined, usuarioId: number, viaId: number) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.observacao = observacao;
        this.via_id = viaId;
        this.usuario_id = usuarioId;
    }
}
