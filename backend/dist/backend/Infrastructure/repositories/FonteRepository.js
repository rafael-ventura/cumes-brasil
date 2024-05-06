"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonteRepository = void 0;
const Fonte_1 = require("../../Domain/entities/Fonte");
const db_1 = require("../config/db");
class FonteRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Fonte_1.Fonte);
    }
    async getById(id) {
        return this.repository.findOne({ where: { id: id } });
    }
    async getAll() {
        return this.repository.find();
    }
    async create(fonte) {
        await this.repository.insert(fonte);
    }
    async update(id, fonteData) {
        await this.repository.update(id, fonteData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.FonteRepository = FonteRepository;
