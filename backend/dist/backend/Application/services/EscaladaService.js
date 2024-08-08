"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaService = void 0;
const EscaladaValidation_1 = __importDefault(require("../../Domain/interfaces/validations/EscaladaValidation"));
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
    async get() {
        return await this.repository.getAll();
    }
    async create(escalada) {
        EscaladaValidation_1.default.valida(escalada);
        return this.repository.createOrUpdate(escalada);
    }
    async update(escalada) {
        const escaladaExiste = await this.repository.getById(escalada.id);
        if (!escaladaExiste) {
            throw new Error("Escalada não encontrada");
        }
        // Atualizar valores de escaladaExiste com valores dentro de escalada
        escaladaExiste.data = escalada.data;
        escaladaExiste.observacao = escalada.observacao;
        // Muito importante remover os participantes anteriores, pois senão continuaram existindo na tabela com escalaId = NULL
        escaladaExiste.participantes.forEach(participante => participante.remove());
        escaladaExiste.participantes = escalada.participantes;
        return this.repository.createOrUpdate(escaladaExiste);
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
