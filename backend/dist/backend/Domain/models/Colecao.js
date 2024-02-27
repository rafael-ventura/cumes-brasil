"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colecao = void 0;
class Colecao {
    constructor(id, nome, descricao, usuarioId, vias) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.usuario_id = usuarioId;
        this.vias = vias || [];
    }
    popularVia(via) {
        this.vias?.push(via);
    }
}
exports.Colecao = Colecao;
