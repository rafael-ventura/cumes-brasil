"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontanhaRepository = void 0;
const db_1 = require("../config/db");
const Montanha_1 = require("../../Domain/entities/Montanha");
class MontanhaRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Montanha_1.Montanha);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagens", "imagem")
            .where("montanha.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagens", "imagem")
            .getMany();
    }
    async create(montanha) {
        await this.repository.insert(montanha);
    }
    async update(id, montanhaData) {
        await this.repository.update(id, montanhaData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.MontanhaRepository = MontanhaRepository;
