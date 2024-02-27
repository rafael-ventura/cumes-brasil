"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoService = void 0;
class ColecaoService {
    constructor(repository, viaRepository) {
        this.repository = repository;
        this.viaRepository = viaRepository;
    }
    async getColecaoById(id) {
        const colecao = await this.repository.getColecaoById(id);
        if (!colecao) {
            throw new Error("Coleção não encontrada");
        }
        return colecao;
    }
    // TODO: Se nao estamos usando, precisamos ter?
    async getViasIdsByColecaoId(id) {
        return this.repository.getViasIdsByColecaoId(id);
    }
    async getColecoesByUsuarioId(usuario_id) {
        if (!usuario_id) {
            throw new Error("Usuário não informado");
        }
        else if (isNaN(usuario_id)) {
            throw new Error("Usuário inválido");
        }
        const colecoes = await this.repository.getColecoesByUsuarioId(usuario_id);
        if (!colecoes) {
            throw new Error("Nenhuma coleção encontrada");
        }
        return colecoes;
    }
    async getColecoes() {
        const colecoes = await this.repository.getColecoes();
        if (!colecoes) {
            throw new Error("Nenhuma coleção encontrada");
        }
        return colecoes;
    }
    async createColecao(colecao) {
        return this.repository.createColecao(colecao);
    }
    async updateColecao(colecao) {
        if (!await this.getColecaoById(colecao.id)) {
            throw new Error("Coleção não encontrada");
        }
        return this.repository.updateColecao(colecao);
    }
    async deleteColecao(id) {
        if (!await this.getColecaoById(id)) {
            throw new Error("Coleção não encontrada");
        }
        return this.repository.deleteColecao(id);
    }
    async addVia(via_id, colecao_id) {
        const colecao = await this.getColecaoById(colecao_id);
        if (!colecao) {
            throw new Error("Coleção não encontrada");
        }
        const via = await this.viaRepository.getViaById(via_id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        return this.repository.addVia(via_id, colecao_id);
    }
    async removeVia(via_id, colecao_id) {
        const colecao = await this.getColecaoById(colecao_id);
        if (!colecao) {
            throw new Error("Coleção não encontrada");
        }
        const via = await this.viaRepository.getViaById(via_id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        return this.repository.removeVia(via_id, colecao_id);
    }
}
exports.ColecaoService = ColecaoService;
