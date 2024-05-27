"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagemRepository = void 0;
const Imagem_1 = require("../../Domain/entities/Imagem");
const db_1 = require("../config/db");
class ImagemRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Imagem_1.Imagem);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("imagem")
            .leftJoinAndSelect("imagem.fonte", "fonte")
            .where("imagem.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("imagem")
            .leftJoinAndSelect("imagem.fonte", "fonte")
            .getMany();
    }
    async create(imagem) {
        await this.repository.insert(imagem);
    }
    async update(id, imagemData) {
        await this.repository.update(id, imagemData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async getByColecaoId(colecaoId) {
        return this.repository.findOne({ where: { colecoes: { id: colecaoId } } });
    }
    async getByUsuarioId(usuarioId) {
        return this.repository.findOne({ where: { usuarios: { id: usuarioId } } });
    }
    async getByMontanhaId(montanhaId) {
        return this.repository.findOne({ where: { montanhas: { id: montanhaId } } });
    }
    async getByViaId(viaId) {
        return this.repository.findOne({ where: { vias: { id: viaId } } });
    }
    async getByCroquiId(croquiId) {
        return this.repository.findOne({ where: { croquis: { id: croquiId } } });
    }
}
exports.ImagemRepository = ImagemRepository;
