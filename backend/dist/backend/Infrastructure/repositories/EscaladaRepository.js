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
        return this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuarioId", "usuario")
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuarioId", "usuario")
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .getMany();
    }
    async createOrUpdate(escalada) {
        await this.repository.save(escalada);
    }
    async remove(escalada) {
        await this.repository.remove(escalada);
    }
    async getByUserId(userId) {
        return this.repository.find({ where: { usuarioId: userId } });
    }
    async getByViaId(viaId) {
        return this.repository.find({ where: { viaId: viaId } });
    }
}
exports.EscaladaRepository = EscaladaRepository;
