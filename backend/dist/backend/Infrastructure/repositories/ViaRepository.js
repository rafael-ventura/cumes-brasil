"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaRepository = void 0;
//src/Infrastructure/repositories/ViaRepository.ts
const Via_1 = require("../../Domain/entities/Via");
const db_1 = require("../config/db");
class ViaRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Via_1.Via);
    }
    async getById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async getAll() {
        return this.repository.find();
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
    async getViasByColecaoId(colecaoId) {
        return this.repository.createQueryBuilder("via")
            .innerJoin("via.colecoes", "colecao")
            .where("colecao.id = :colecaoId", { colecaoId })
            .getMany();
    }
    async getDetalhadoById(id) {
        return this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.imagem", "imagem")
            .where("via.id = :id", { id })
            .getOne();
    }
    async getAllDetalhado() {
        const vias = await this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.imagem", "imagem")
            .getMany();
        console.log(vias);
        return vias;
    }
}
exports.ViaRepository = ViaRepository;
