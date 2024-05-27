"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaRepository = void 0;
const db_1 = require("../config/db");
const Escalada_1 = require("../../Domain/entities/Escalada");
class EscaladaRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Escalada_1.Escalada);
    }
    async getById(id) {
        return this.repository.findOne({ where: { id: id } });
    }
    async getAll() {
        return this.repository.find();
    }
    async create(escalada) {
        await this.repository.insert(escalada);
    }
    async update(id, escaladaData) {
        await this.repository.update(id, escaladaData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async getByUserId(userId) {
        return this.repository.find({ where: { usuario: userId } });
    }
    async getByViaId(viaId) {
        return this.repository.find({ where: { via: viaId } });
    }
}
exports.EscaladaRepository = EscaladaRepository;
