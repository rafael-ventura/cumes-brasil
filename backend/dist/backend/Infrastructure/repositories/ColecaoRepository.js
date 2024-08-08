"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoRepository = void 0;
const db_1 = require("../config/db");
const Colecao_1 = require("../../Domain/entities/Colecao");
const typedi_1 = require("typedi");
let ColecaoRepository = class ColecaoRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Colecao_1.Colecao);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .leftJoinAndSelect("colecao.vias", "vias")
            .where("colecao.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .leftJoinAndSelect("colecao.vias", "vias")
            .getMany();
    }
    async getByUsuarioId(usuario_id) {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .leftJoinAndSelect("colecao.vias", "vias")
            .where("usuario.id = :usuario_id", { usuario_id })
            .getMany();
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
        return this.repository.createQueryBuilder()
            .relation(Colecao_1.Colecao, 'vias')
            .of(colecao_id)
            .add(via_id);
    }
    async removeViaFromColecao(via_id, colecao_id) {
        return this.repository.createQueryBuilder()
            .relation(Colecao_1.Colecao, 'vias')
            .of(colecao_id)
            .remove(via_id);
    }
    async getColecoesNotContainingVia(viaId, page, limit) {
        const offset = (page - 1) * limit;
        const [colecoes, total] = await this.repository.createQueryBuilder('colecao')
            .leftJoinAndSelect('colecao.viasColecoes', 'viasColecoes')
            .leftJoinAndSelect('colecao.imagem', 'imagem')
            .leftJoinAndSelect('colecao.usuario', 'usuario')
            .where('viasColecoes.via_id IS NULL OR viasColecoes.via_id != :viaId', { viaId })
            .andWhere((qb) => {
            const subQuery = qb.subQuery()
                .select('colecao.id')
                .from('colecao', 'colecao')
                .leftJoin('colecao.viasColecoes', 'viasColecoes')
                .where('viasColecoes.via_id = :viaId')
                .getQuery();
            return 'colecao.id NOT IN ' + subQuery;
        })
            .skip(offset)
            .take(limit)
            .getManyAndCount();
        return {
            colecoes,
            total
        };
    }
    ;
    async search(query) {
        const { nomeColecao, nomeVia, nomeMontanha } = query;
        let qb = this.repository.createQueryBuilder('colecao')
            .leftJoinAndSelect('colecao.vias', 'via')
            .leftJoinAndSelect('via.montanha', 'montanha');
        if (nomeColecao) {
            qb = qb.andWhere('colecao.nome LIKE :nomeColecao', { nomeColecao: `%${nomeColecao}%` });
        }
        if (nomeVia) {
            qb = qb.andWhere('via.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }
        if (nomeMontanha) {
            qb = qb.andWhere('montanha.nome LIKE :nomeMontanha', { nomeMontanha: `%${nomeMontanha}%` });
        }
        return {
            items: await qb.getMany(),
            totalItems: await qb.getCount(),
            totalPages: 1
        };
    }
};
exports.ColecaoRepository = ColecaoRepository;
exports.ColecaoRepository = ColecaoRepository = __decorate([
    (0, typedi_1.Service)()
], ColecaoRepository);
