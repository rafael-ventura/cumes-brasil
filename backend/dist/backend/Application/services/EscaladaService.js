"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaService = void 0;
class EscaladaService {
    constructor(repository, usuarioService, viaService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
        this.viaService = viaService;
    }
    async getById(id) {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
        return this.repository.getById(id);
    }
    async get() {
        return this.repository.getAll();
    }
    async create(escalada) {
        return this.repository.create(escalada);
    }
    async update(escalada) {
        const escaladaExiste = await this.repository.getById(escalada.id);
        if (!escaladaExiste) {
            throw new Error("Escalada não encontrada");
        }
        return this.repository.update(escalada.id, escalada);
    }
    async delete(id) {
        const escaladaExiste = await this.repository.getById(id);
        if (!escaladaExiste) {
            throw new Error("Escalada não encontrada");
        }
        return this.repository.delete(id);
    }
    async getEscaladasDoUsuario(usuario_id) {
        if (!usuario_id) {
            throw new Error("ID do usuário não fornecido");
        }
        else if (isNaN(usuario_id)) {
            throw new Error("ID do usuário inválido");
        }
        return this.repository.getByUserId(usuario_id);
    }
    async getEscaladasDaVia(via_id) {
        if (!via_id) {
            throw new Error("ID da via não fornecido");
        }
        else if (isNaN(via_id)) {
            throw new Error("ID da via inválido");
        }
        return this.repository.getByViaId(via_id);
    }
}
exports.EscaladaService = EscaladaService;
