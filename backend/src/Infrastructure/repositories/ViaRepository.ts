import {Via} from '../../Domain/entities/Via';
import {AppDataSource} from '../config/db';
import {ISearchRepository} from '../../Domain/interfaces/repositories/ISearchRepository';
import {ISearchResult} from '../../Domain/interfaces/models/ISearchResult';
import {ViaColecao} from '../../Domain/entities/ViaColecao';
import BaseRepository from './BaseRepository';
import {ICrudRepository} from '../../Domain/interfaces/repositories/ICrudRepository';

export class ViaRepository extends BaseRepository<Via> implements ISearchRepository<Via>, ICrudRepository<Via> {
    constructor() {
        super(Via);
    }

    private withRelations(qb: any) {
        return qb
            .leftJoinAndSelect("via.localizacao", "localizacao")
            .leftJoinAndSelect("localizacao.bairro", "bairro")
            .leftJoinAndSelect("localizacao.cidade", "cidade")
            .leftJoinAndSelect("localizacao.estado", "estado")
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.imagem", "imagem")
            .leftJoinAndSelect("via.viaCroquis", "viaCroquis")
            .leftJoinAndSelect("viaCroquis.croqui", "croqui");
    }

    async getById(id: number, relations?: string[]): Promise<Via | null> {
        return this.withRelations(
            this.repository.createQueryBuilder("via").where("via.id = :id", {id})
        ).getOne();
    }

    async getAllPaginated(page: number, limit: number): Promise<{ items: Via[]; total: number; totalPages: number }> {
        const [vias, total] = await this.withRelations(
            this.repository.createQueryBuilder("via")
        )
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getAllWithoutPagination(): Promise<{ items: Via[]; total: number; totalPages: number }> {
        const [vias, total] = await this.withRelations(
            this.repository.createQueryBuilder("via")
        ).getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: 1,
        };
    }

    async getRandom(): Promise<Via | null> {
        return this.withRelations(
            this.repository.createQueryBuilder("via").orderBy("RANDOM()")
        ).getOne();
    }

    async create(via: Partial<Via>): Promise<Via> {
        const insertResult = await this.repository.insert(via);
        const id = insertResult.identifiers[0].id;
        return this.getById(id) as Promise<Via>;
    }

    async updateVia(id: number, viaData: Partial<Via>): Promise<Via | null> {
        await this.repository.update(id, viaData);
        return this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async getViasByColecaoId(colecaoId: number, page: number, limit: number): Promise<{
        items: Via[],
        total: number,
        totalPages: number
    }> {
        const subQuery = AppDataSource.getRepository(ViaColecao)
            .createQueryBuilder("via_colecao")
            .select("via_colecao.viaId")
            .where("via_colecao.colecaoId = :colecaoId", {colecaoId});

        const [vias, total] = await this.withRelations(
            this.repository.createQueryBuilder("via")
                .where(`via.id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters())
        )
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getViasNotInColecaoForUser(colecaoId: number, usuarioId: number, page: number, limit: number): Promise<{
        items: Via[],
        total: number,
        totalPages: number
    }> {
        const subQuery = AppDataSource.getRepository(ViaColecao)
            .createQueryBuilder("via_colecao")
            .select("via_colecao.viaId")
            .innerJoin("via_colecao.colecao", "colecao")
            .where("via_colecao.colecaoId = :colecaoId", {colecaoId})
            .andWhere("colecao.usuarioId = :usuarioId", {usuarioId});

        const [vias, total] = await this.withRelations(
            this.repository.createQueryBuilder("via")
                .where(`via.id NOT IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters())
        )
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async search(query: any): Promise<ISearchResult<any>> {
        const {
            unifiedSearch,
            selectedMountain,
            selectedDifficulty,
            selectedCrux,
            selectedExtensionCategory,
            selectedExposicao,
            colecaoId,
            bairro,
            page = 1,
            itemsPerPage = 10,
            sortField,
            sortOrder,
        } = query;

        let qb = this.repository.createQueryBuilder("via")
            .leftJoinAndSelect("via.localizacao", "localizacao")
            .leftJoinAndSelect("localizacao.bairro", "bairro")
            .leftJoinAndSelect("via.imagem", "imagem");

        if (colecaoId) {
            qb = qb.innerJoin("via.viaColecoes", "viaColecaoFilter", "viaColecaoFilter.colecaoId = :colecaoId", {colecaoId})
                .addSelect("viaColecaoFilter.data_adicao", "data_adicao");
        }

        if (unifiedSearch) {
            qb = qb.andWhere(
                "(via.nome LIKE :unifiedSearch OR localizacao.bairro.nome LIKE :unifiedSearch)",
                {unifiedSearch: `%${unifiedSearch}%`}
            );
        }

        if (bairro) {
            qb = qb.andWhere("LOWER(bairro.nome) = :bairro", {bairro: bairro.toLowerCase()});
        }

        if (selectedMountain) {
            // TODO: Implementar busca por montanha através de localização ou criar relação via -> montanha
            // Por enquanto, removido pois não temos mais relação direta
        }

        if (selectedDifficulty) {
            qb = qb.andWhere("via.grau = :selectedDifficulty", {selectedDifficulty});
        }

        if (selectedCrux) {
            qb = qb.andWhere("via.crux = :selectedCrux", {selectedCrux});
        }

        if (selectedExtensionCategory) {
            qb = qb.andWhere("via.extensao >= :minExtension AND via.extensao <= :maxExtension", {
                minExtension: selectedExtensionCategory[0],
                maxExtension: selectedExtensionCategory[1],
            });
        }

        if (selectedExposicao) {
            if (selectedExposicao[0] === "e1" && selectedExposicao[1] === "e2") {
                qb = qb.andWhere("LOWER(via.exposicao) IN (:...selectedExposicao)", {selectedExposicao});
            } else {
                qb = qb.andWhere("via.exposicao LIKE :selectedExposicao", {selectedExposicao: `${selectedExposicao[0]}%`});
            }
        }

        if (sortField && sortOrder) {
            qb = qb.orderBy(`via.${sortField}`, sortOrder.toUpperCase());
        }

        const totalItems = await qb.getCount();

        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getRawAndEntities();

        const mappedItems = items.entities.map((item, index) => {
            const rawData = items.raw[index];
            return {...item, data_adicao: rawData.data_adicao || null};
        });

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return {items: mappedItems, totalPages, totalItems};
    }

    async countByField(field: string, value: any, operator: string = "="): Promise<number> {
        const queryBuilder = this.repository.createQueryBuilder("via");

        if (field === "via.exposicao" || field === "via.duracao") {
            queryBuilder.where(`${field} LIKE :value`, {value: `%${value}%`});
        } else {
            queryBuilder.where(`${field} ${operator} :value`, {value});
        }

        return queryBuilder.getCount();
    }

    async countByBairro(bairro: string): Promise<number> {
        return this.repository.createQueryBuilder("via")
            .leftJoin("via.localizacao", "localizacao")
            .leftJoin("localizacao.bairro", "bairro")
            .where("LOWER(bairro.nome) = :bairro", { bairro: bairro.toLowerCase() })
            .getCount();
    }
}
