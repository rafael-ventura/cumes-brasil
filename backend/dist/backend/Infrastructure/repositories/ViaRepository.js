"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaRepository = void 0;
const Via_1 = require("../../Domain/entities/Via");
const db_1 = require("../config/db");
class ViaRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Via_1.Via);
    }
    async getById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["montanha", "face", "fonte", "croquis"],
        });
    }
    async getAll() {
        return this.repository.find({ relations: ["montanha", "face", "fonte", "croquis"] });
    }
    async create(via) {
        await this.repository.insert(via);
    }
    async update(id, viaData) {
        await this.repository.update(id, viaData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async addCroqui(viaId, croquiId) {
        await this.repository.createQueryBuilder()
            .relation(Via_1.Via, "croquis")
            .of(viaId)
            .add(croquiId);
    }
    async removeCroqui(viaId, croquiId) {
        await this.repository.createQueryBuilder()
            .relation(Via_1.Via, "croquis")
            .of(viaId)
            .remove(croquiId);
    }
    async getViasIdByColecaoId(colecaoId) {
        const vias = await this.repository.createQueryBuilder("via")
            .leftJoin("via.colecoes", "colecao")
            .where("colecao.id = :colecaoId", { colecaoId })
            .getMany();
        return vias.map(via => via.id);
    }
}
exports.ViaRepository = ViaRepository;
