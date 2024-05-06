"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoRepository = void 0;
const db_1 = require("../config/db");
const Colecao_1 = require("../../Domain/entities/Colecao");
const Via_1 = require("../../Domain/entities/Via");
class ColecaoRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Colecao_1.Colecao);
        this.viaRepository = db_1.AppDataSource.getRepository(Via_1.Via);
    }
    async getById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["vias", "usuario"]
        });
    }
    async getAll() {
        return this.repository.find({
            relations: ["vias", "usuario"]
        });
    }
    async getByUsuarioId(usuarioId) {
        return this.repository.find({
            where: { usuario: usuarioId },
            relations: ["vias", "usuario"]
        });
    }
    async create(colecaoData) {
        await this.repository.save(colecaoData);
    }
    async update(id, colecaoData) {
        await this.repository.save({
            ...colecaoData,
            id: Number(id)
        });
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async addViaToColecao(viaId, colecaoId) {
        const colecao = await this.getById(colecaoId);
        if (colecao) {
            const via = await this.viaRepository.findOne(viaId);
            if (via) {
                colecao.vias.push(via);
                await this.repository.save(colecao);
            }
        }
    }
    async removeViaFromColecao(viaId, colecaoId) {
        const colecao = await this.getById(colecaoId);
        if (colecao) {
            colecao.vias = colecao.vias.filter(via => via.id !== viaId);
            await this.repository.save(colecao);
        }
    }
}
exports.ColecaoRepository = ColecaoRepository;
