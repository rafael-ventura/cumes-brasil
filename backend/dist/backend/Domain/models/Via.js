"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Via = void 0;
class Via {
    constructor(id, nome, grau, crux, artificial, duracao, exposicao, extensao, conquistadores, detalhes, data, montanhaId, faceId, viaPrincipalId, fonteId, croqui) {
        this.id = id;
        this.nome = nome;
        this.grau = grau;
        this.crux = crux;
        this.artificial = artificial;
        this.duracao = duracao;
        this.exposicao = exposicao;
        this.extensao = extensao;
        this.conquistadores = conquistadores;
        this.detalhes = detalhes;
        this.data = data;
        this.montanha_id = montanhaId;
        this.face_id = faceId;
        this.via_principal_id = viaPrincipalId;
        this.fonte_id = fonteId;
        this.croquis = croqui || [];
    }
    popularCroqui(croqui) {
        this.croquis?.push(croqui);
    }
    associarMontanha(montanhaId) {
        this.montanha_id = montanhaId;
    }
    associarFace(faceId) {
        this.face_id = faceId;
    }
    associarViaPrincipal(viaPrincipalId) {
        this.via_principal_id = viaPrincipalId;
    }
    associarFonte(fonteId) {
        this.fonte_id = fonteId;
    }
}
exports.Via = Via;
