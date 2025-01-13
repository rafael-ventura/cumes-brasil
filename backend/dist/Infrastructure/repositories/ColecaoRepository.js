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
const Via_1 = require("../../Domain/entities/Via");
const ViaColecao_1 = require("../../Domain/entities/ViaColecao");
let ColecaoRepository = class ColecaoRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Colecao_1.Colecao);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("colecao")
            .leftJoinAndSelect('colecao.usuario', 'usuario')
            .leftJoinAndSelect('colecao.imagem', 'imagem')
            .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
            .leftJoinAndSelect('viaColecao.via', 'vias')
            .where('colecao.id = :id', { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("colecao")
            .leftJoinAndSelect('colecao.usuario', 'usuario')
            .leftJoinAndSelect('colecao.imagem', 'imagem')
            .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
            .leftJoinAndSelect('viaColecao.via', 'vias')
            .getMany();
    }
    async getByUsuarioId(usuario_id) {
        return this.repository.createQueryBuilder("colecao")
            .leftJoinAndSelect('colecao.usuario', 'usuario')
            .leftJoinAndSelect('colecao.imagem', 'imagem')
            .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
            .leftJoinAndSelect('viaColecao.via', 'vias')
            .where('usuario.id = :usuario_id', { usuario_id })
            .getMany();
    }
    async create(colecaoData) {
        await this.repository.save(colecaoData);
    }
    async update(id, colecaoData) {
        await this.repository.update(id, colecaoData);
    }
    async addViaToColecao(via_id, colecao_id) {
        // Verificar se a coleção existe
        const colecao = await this.repository.findOne({ where: { id: colecao_id } });
        if (!colecao) {
            throw new Error('Coleção não encontrada');
        }
        // Verificar se a via existe
        const via = await db_1.AppDataSource.getRepository(Via_1.Via).findOne({ where: { id: via_id } });
        if (!via) {
            throw new Error('Via não encontrada');
        }
        // Criar uma nova instância de ViaColecao
        const viaColecao = new ViaColecao_1.ViaColecao();
        viaColecao.colecao = colecao;
        viaColecao.via = via;
        // Salvar a relação usando o repositório de ViaColecao
        const viaColecaoRepository = db_1.AppDataSource.getRepository(ViaColecao_1.ViaColecao);
        await viaColecaoRepository.save(viaColecao);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async removeViaFromColecao(via_id, colecao_id) {
        const viaColecaoRepository = db_1.AppDataSource.getRepository(ViaColecao_1.ViaColecao);
        await viaColecaoRepository.delete({
            via: { id: via_id },
            colecao: { id: colecao_id }
        });
    }
    async getColecoesNotContainingVia(viaId, page, limit) {
        const subQuery = db_1.AppDataSource.getRepository(ViaColecao_1.ViaColecao)
            .createQueryBuilder('via_colecao')
            .select('via_colecao.colecaoId')
            .where('via_colecao.viaId = :viaId', { viaId });
        const [colecoes, total] = await this.repository.createQueryBuilder('colecao')
            .leftJoinAndSelect('colecao.imagem', 'imagem')
            .where(`colecao.id NOT IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters())
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            colecoes: colecoes, // Garantir que o TypeScript entenda o tipo
            total
        };
    }
    async search(query) {
        const { searchQuery, colecaoId, usuarioId, nomeVia, nomeMontanha, sortField, sortOrder, page = 1, itemsPerPage = 10 } = query;
        // Ajuste das junções
        let qb = this.repository.createQueryBuilder('colecao')
            .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
            .leftJoinAndSelect('viaColecao.via', 'via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('colecao.imagem', 'imagem');
        // Filtro default pelo ID do usuário logado
        qb = qb.andWhere('colecao.usuario.id = :usuarioId', { usuarioId });
        // Filtro por ID da coleção
        if (colecaoId) {
            qb = qb.andWhere('colecao.id = :colecaoId', { colecaoId });
        }
        // Filtro por nome da coleção
        if (searchQuery) {
            qb = qb.andWhere('colecao.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
        }
        // Filtro por nome da via (caso queira buscar por vias dentro da coleção)
        if (nomeVia) {
            qb = qb.andWhere('via.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }
        // Filtro por nome da montanha caso você queira buscar coleções que tenham vias em uma determinada montanha)
        if (nomeMontanha) {
            qb = qb.andWhere('montanha.nome LIKE :nomeMontanha', { nomeMontanha: `%${nomeMontanha}%` });
        }
        // Aplicação da ordenação dinâmica
        if (sortField && sortOrder) {
            qb = qb.orderBy(`colecao.${sortField}`, sortOrder.toUpperCase());
        }
        // Contar o total de itens (coleções) correspondentes
        const totalItems = await qb.getCount();
        // Buscar coleções paginadas
        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getMany();
        // Calcular total de páginas
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return {
            items: items, // Garantir que o TypeScript entenda o tipo
            totalPages,
            totalItems
        };
    }
};
exports.ColecaoRepository = ColecaoRepository;
exports.ColecaoRepository = ColecaoRepository = __decorate([
    (0, typedi_1.Service)()
], ColecaoRepository);
