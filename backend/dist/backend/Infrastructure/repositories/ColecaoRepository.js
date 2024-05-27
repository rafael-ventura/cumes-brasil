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
            relations: ["vias"]
        });
    }
    async getAll() {
        return this.repository.find({
            relations: ["vias"]
        });
    }
    async getByUsuarioId(usuarioId) {
        return this.repository.find({
            where: {
                usuario: {
                    id: usuarioId
                }
            },
            relations: ["vias", "imagem", "usuario"]
        });
    }
    async create(colecaoData) {
        await this.repository.save(colecaoData);
    }
    async update(id, colecaoData) {
        await this.repository.update(id, colecaoData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async addViaToColecao(via_id, colecao_id) {
        const existingRelation = await this.viaRepository.createQueryBuilder()
            .relation(Via_1.Via, "colecoes")
            .of(via_id)
            .loadMany();
        if (existingRelation.some(colecao => colecao.id === colecao_id)) {
            return;
        }
        await this.viaRepository.createQueryBuilder()
            .relation(Via_1.Via, "colecoes")
            .of(via_id)
            .add(colecao_id);
    }
    async removeViaFromColecao(via_id, colecao_id) {
        await this.viaRepository.createQueryBuilder()
            .relation(Via_1.Via, "colecoes")
            .of(via_id)
            .remove(colecao_id);
    }
}
exports.ColecaoRepository = ColecaoRepository;
