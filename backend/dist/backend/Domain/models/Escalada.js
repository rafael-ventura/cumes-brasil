"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Escalada = void 0;
class Escalada {
    constructor(id, nome, data, descricao, observacao, usuarioId, viaId) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.descricao = descricao;
        this.observacao = observacao;
        this.via_id = viaId;
        this.usuario_id = usuarioId;
    }
}
exports.Escalada = Escalada;
