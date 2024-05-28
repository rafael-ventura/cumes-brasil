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
        return this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.imagem", "imagem")
            .leftJoinAndSelect("via.croquis", "croquis")
            .where("via.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return await this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.imagem", "imagem")
            .leftJoinAndSelect("via.croquis", "croquis")
            .getMany();
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
        return await this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.viasColecoes", "viasColecoes")
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.imagem", "imagem")
            .leftJoinAndSelect("via.croquis", "croquis")
            .where("viasColecoes.colecao_id = :colecaoId", { colecaoId })
            .getMany();
    }
}
exports.ViaRepository = ViaRepository;
