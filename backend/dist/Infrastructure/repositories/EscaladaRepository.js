"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaRepository = void 0;
const db_1 = require("../config/db");
const Escalada_1 = require("../../Domain/entities/Escalada");
class EscaladaRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Escalada_1.Escalada);
        this.USER_INFO = ["usuario.id", "usuario.nome", "usuario.email",
            "usuario.data_atividade", "usuario.clube_organizacao", "localizacao",
            "biografia"];
    }
    async getById(id) {
        return this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuarioId", "usuario")
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.id = :id", { id })
            .getOne();
    }
    async getAll(limit) {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");
        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }
    async save(escalada) {
        await this.repository.save(escalada);
    }
    async remove(escalada) {
        await this.repository.remove(escalada);
    }
    async getByUserId(userId) {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoin("escalada.viaId", "via")
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("usuario.id = :userId", { userId })
            .orderBy("escalada.data", "DESC");
        return query.getMany();
    }
    async getByViaId(viaId, limit) {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoin("escalada.viaId", "via")
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.viaId = :viaId", { viaId })
            .orderBy("escalada.data", "DESC");
        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }
    async getByViaIdAndByUser(userId, viaId, limit) {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoin("escalada.viaId", "via")
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("usuario.id = :userId AND escalada.viaId = :viaId", { userId, viaId })
            .orderBy("escalada.data", "DESC");
        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }
    async search(filters) {
        const { unifiedSearch, page = 1, itemsPerPage = 10 } = filters;
        let qb = this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuario", "usuario")
            .leftJoinAndSelect("escalada.via", "via")
            .leftJoinAndSelect("via.imagem", "imagem") // Acessar a imagem através da via
            //acessar tambem os participantes
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");
        // Filtrar por nome da via (se necessário)
        if (unifiedSearch) {
            qb = qb.andWhere("via.nome LIKE :unifiedSearch", { unifiedSearch: `%${unifiedSearch}%` });
        }
        // Não temos suporte a ordenação por campo em Escalada
        /*if (sortField && sortOrder) {
            qb = qb.orderBy(`escalada.${sortField}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
        }*/
        // Total de escaladas que correspondem aos filtros
        const totalItems = await qb.getCount();
        // Escaladas paginadas
        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getMany();
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return {
            items,
            totalPages,
            totalItems
        };
    }
}
exports.EscaladaRepository = EscaladaRepository;
