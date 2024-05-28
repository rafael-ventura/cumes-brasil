"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoRepository = void 0;
const db_1 = require("../config/db");
const Colecao_1 = require("../../Domain/entities/Colecao");
const Via_1 = require("../../Domain/entities/Via");
const ColecaoVia_1 = require("../../Domain/entities/ColecaoVia");
class ColecaoRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Colecao_1.Colecao);
        this.viaRepository = db_1.AppDataSource.getRepository(Via_1.Via);
        this.colecaoViaRepository = db_1.AppDataSource.getRepository(ColecaoVia_1.ColecaoVia);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("colecao")
            .leftJoinAndSelect("colecao.usuario", "usuario")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .where("colecao.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("colecao")
            .leftJoinAndSelect("colecao.usuario", "usuario")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .getMany();
    }
    async getByUsuarioId(usuario_id) {
        return this.repository.find({ where: { id: usuario_id } });
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
        const existingEntry = await this.colecaoViaRepository.findOne({
            where: {
                via_id,
                colecao_id
            }
        });
        if (existingEntry) {
            throw new Error("A via já está presente nesta coleção.");
        }
        const colecaoVia = this.colecaoViaRepository.create({
            via_id,
            colecao_id
        });
        await this.colecaoViaRepository.save(colecaoVia);
    }
    async removeViaFromColecao(via_id, colecao_id) {
        await this.colecaoViaRepository.delete({
            via_id,
            colecao_id
        });
    }
}
exports.ColecaoRepository = ColecaoRepository;
