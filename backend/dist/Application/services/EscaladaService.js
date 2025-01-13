"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaService = void 0;
const EscaladaValidation_1 = __importDefault(require("../validations/EscaladaValidation"));
class EscaladaService {
    constructor(repository, usuarioService, viaService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
        this.viaService = viaService;
    }
    async getById(id) {
        if (!id) {
            throw new Error("ID da Fonte não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Fonte inválido");
        }
        return await this.repository.getById(id);
    }
    async getAll(limit) {
        return await this.repository.getAll(limit);
    }
    async create(escalada) {
        EscaladaValidation_1.default.valida(escalada);
        return this.repository.save(escalada);
    }
    async update(escalada) {
        const escaladaExiste = await this.repository.getById(escalada.id);
        if (!escaladaExiste) {
            throw new Error("Escalada não encontrada");
        }
        escaladaExiste.data = escalada.data;
        escaladaExiste.observacao = escalada.observacao;
        escaladaExiste.participantes.forEach(participante => participante.remove());
        escaladaExiste.participantes = escalada.participantes;
        return this.repository.save(escaladaExiste);
    }
    async delete(id) {
        const escaladaExiste = await this.repository.getById(id);
        if (!escaladaExiste) {
            throw new Error("Escalada não encontrada");
        }
        return this.repository.remove(escaladaExiste);
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
    async getEscaladasDaVia(via_id, limit) {
        if (!via_id) {
            throw new Error("ID da via não fornecido");
        }
        else if (isNaN(via_id)) {
            throw new Error("ID da via inválido");
        }
        return this.repository.getByViaId(via_id, limit);
    }
    async getEscaladasDaViaDoUsuario(usuario_id, via_id, limit) {
        if (!via_id) {
            throw new Error("ID da via não fornecido");
        }
        else if (isNaN(via_id)) {
            throw new Error("ID da via inválido");
        }
        else if (!usuario_id) {
            throw new Error("ID do usuário não fornecido");
        }
        else if (isNaN(usuario_id)) {
            throw new Error("ID do usuário inválido");
        }
        return this.repository.getByViaIdAndByUser(usuario_id, via_id, limit);
    }
}
exports.EscaladaService = EscaladaService;
