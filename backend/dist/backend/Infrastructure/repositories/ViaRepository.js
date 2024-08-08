"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaRepository = void 0;
const Via_1 = require("../../Domain/entities/Via");
const db_1 = require("../config/db");
class ViaRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Via_1.Via);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.imagem", "imagem")
            .leftJoinAndSelect("via.croquis", "croquis")
            .where("via.id = :id", { id })
            .getOne();
    }
    async getAll(page, limit) {
        const [vias, total] = await this.repository.createQueryBuilder('via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
            .leftJoinAndSelect('via.fonte', 'fonte')
            .leftJoinAndSelect('via.face', 'face')
            .leftJoinAndSelect('via.imagem', 'imagem')
            .leftJoinAndSelect('via.croquis', 'croquis')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            vias,
            total
        };
    }
    async create(via) {
        await this.repository.insert(via);
    }
    async update(id, viaData) {
        await this.repository.update(id, viaData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async getViasByColecaoId(colecaoId, page, limit) {
        const [vias, total] = await this.repository.createQueryBuilder('via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
            .leftJoinAndSelect('via.fonte', 'fonte')
            .leftJoinAndSelect('via.face', 'face')
            .leftJoinAndSelect('via.imagem', 'imagem')
            .leftJoin('via.colecoes', 'colecoes')
            .where('colecoes.id = :colecaoId', { colecaoId })
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            vias,
            total
        };
    }
    async getViasNotInColecaoId(colecaoId, page, limit) {
        const [vias, total] = await this.repository.createQueryBuilder('via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
            .leftJoinAndSelect('via.fonte', 'fonte')
            .leftJoinAndSelect('via.face', 'face')
            .leftJoinAndSelect('via.imagem', 'imagem')
            .leftJoin('via.colecoes', 'colecoes')
            .where('colecoes.id IS NULL OR colecoes.id != :colecaoId', { colecaoId })
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            vias,
            total
        };
    }
    async getAllWithoutPagination() {
        const [vias, total] = await this.repository.createQueryBuilder('via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
            .leftJoinAndSelect('via.fonte', 'fonte')
            .leftJoinAndSelect('via.face', 'face')
            .leftJoinAndSelect('via.imagem', 'imagem')
            .leftJoinAndSelect('via.croquis', 'croquis')
            .getManyAndCount();
        return {
            vias,
            total
        };
    }
    async search(query) {
        console.log("Query received:", query); // Adicione esta linha para depuração
        const { searchQuery, selectedMountain, selectedDifficulty, selectedCrux, selectedExtensionCategory, page = 1, itemsPerPage = 10 } = query;
        let qb = this.repository.createQueryBuilder('via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('via.imagem', 'imagem');
        if (searchQuery) {
            qb = qb.andWhere('via.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
        }
        if (selectedMountain) {
            qb = qb.andWhere('montanha.nome = :selectedMountain', { selectedMountain }); // Filtra pelo nome da montanha
        }
        if (selectedDifficulty) {
            qb = qb.andWhere('via.grau = :selectedDifficulty', { selectedDifficulty });
        }
        if (selectedCrux) {
            qb = qb.andWhere('via.crux = :selectedCrux', { selectedCrux });
        }
        if (selectedExtensionCategory) {
            qb = qb.andWhere('via.extensao >= :minExtension AND via.extensao <= :maxExtension', {
                minExtension: selectedExtensionCategory[0],
                maxExtension: selectedExtensionCategory[1]
            });
        }
        // Contar o total de itens
        const totalItems = await qb.getCount();
        // Buscar itens paginados
        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getMany();
        // Calcular total de páginas
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        console.log("Query result:", { items, totalItems, totalPages });
        return {
            items,
            totalPages,
            totalItems
        };
    }
}
exports.ViaRepository = ViaRepository;
