"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroquiRepository = void 0;
const db_1 = require("../config/db");
const Croqui_1 = require("../../Domain/entities/Croqui");
class CroquiRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Croqui_1.Croqui);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("croqui")
            .leftJoinAndSelect("croqui.fonte", "fonte")
            .leftJoinAndSelect("croqui.imagem", "imagem")
            .where("croqui.id = :id", { id })
            .getOne();
    }
    async getByIds(ids) {
        return this.repository.createQueryBuilder("croqui")
            .leftJoinAndSelect("croqui.fonte", "fonte")
            .leftJoinAndSelect("croqui.imagem", "imagem")
            .where("croqui.id IN (:...ids)", { ids })
            .getMany();
    }
    async getAll() {
        return this.repository.createQueryBuilder("croqui")
            .leftJoinAndSelect("croqui.fonte", "fonte")
            .leftJoinAndSelect("croqui.imagem", "imagem")
            .getMany();
    }
    async create(croqui) {
        await this.repository.insert(croqui);
    }
    async update(id, croquiData) {
        await this.repository.update(id, croquiData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async getIdsByViaId(via_id) {
        return this.repository.createQueryBuilder("croqui")
            .leftJoin("croqui.vias", "via")
            .where("via.id = :via_id", { via_id })
            .select("croqui.id")
            .getRawMany()
            .then((croquis) => croquis.map(croqui => croqui.id));
    }
    async getByViaId(via_id) {
        return this.repository.createQueryBuilder("croqui")
            .leftJoin("croqui.vias", "via")
            .where("via.id = :via_id", { via_id })
            .getRawMany();
    }
    async associarVia(croqui_id, via_id) {
        return this.repository.createQueryBuilder()
            .relation(Croqui_1.Croqui, "vias")
            .of(croqui_id)
            .add(via_id);
    }
    async desassociarVia(croqui_id, via_id) {
        return this.repository.createQueryBuilder()
            .relation(Croqui_1.Croqui, "vias")
            .of(croqui_id)
            .remove(via_id);
    }
}
exports.CroquiRepository = CroquiRepository;
