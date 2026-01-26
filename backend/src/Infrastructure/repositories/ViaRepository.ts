import { Via } from '../../Domain/entities/Via';
import { AppDataSource } from '../config/db';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ViaColecao } from '../../Domain/entities/ViaColecao';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';
import { withViaRelations } from '../helpers/QueryRelations';

export class ViaRepository extends BaseRepository<Via> implements ISearchRepository<Via>, ICrudRepository<Via> {
    constructor() {
        super(Via);
    }

    async getById(id: number, relations?: string[]): Promise<Via | null> {
        const qb = this.repository.createQueryBuilder('via')
            .where('via.id = :id', { id });
        
        return withViaRelations(qb, 'full').getOne();
    }

    async getAllPaginated(page: number, limit: number): Promise<{ items: Via[]; total: number; totalPages: number }> {
        const qb = this.repository.createQueryBuilder('via');
        
        const [vias, total] = await withViaRelations(qb, 'light')
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
        const qb = this.repository.createQueryBuilder('via');
        
        const [vias, total] = await withViaRelations(qb, 'light').getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: 1,
        };
    }

    async getRandom(): Promise<Via | null> {
        const qb = this.repository.createQueryBuilder('via')
            .orderBy('RANDOM()');
        
        return withViaRelations(qb, 'light').getOne();
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
            .createQueryBuilder('via_colecao')
            .select('via_colecao.viaId')
            .where('via_colecao.colecaoId = :colecaoId', { colecaoId });

        const qb = this.repository.createQueryBuilder('via')
            .where(`via.id IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters());

        const [vias, total] = await withViaRelations(qb, 'light')
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
            .createQueryBuilder('via_colecao')
            .select('via_colecao.viaId')
            .innerJoin('via_colecao.colecao', 'colecao')
            .where('via_colecao.colecaoId = :colecaoId', { colecaoId })
            .andWhere('colecao.usuarioId = :usuarioId', { usuarioId });

        const qb = this.repository.createQueryBuilder('via')
            .where(`via.id NOT IN (${subQuery.getQuery()})`)
            .setParameters(subQuery.getParameters());

        const [vias, total] = await withViaRelations(qb, 'light')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Search method with complex filtering requirements
     * Uses custom joins to support filtering by all bairro paths
     * (setorBairro, setorFaceBairro, setorMontanhaBairro, faceBairro, montanhaBairro)
     */
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
            tipo_rocha,
            tipo_escalada,
            modalidade,
            page = 1,
            itemsPerPage = 10,
            sortField,
            sortOrder,
        } = query;

        // Custom joins for search - needs all bairro paths for filtering
        let qb = this.repository.createQueryBuilder('via')
            .leftJoinAndSelect('via.montanha', 'montanha')
            .leftJoinAndSelect('via.face', 'face')
            .leftJoinAndSelect('via.setor', 'setor')
            .leftJoinAndSelect('via.imagem', 'imagem')
            // Setor relations
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
            .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
            .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
            .leftJoinAndSelect('setor.face', 'setorFace')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            // Setor -> Face relations
            .leftJoinAndSelect('setorFace.localizacoes', 'setorFaceLocalizacoes')
            .leftJoinAndSelect('setorFaceLocalizacoes.bairro', 'setorFaceBairro')
            .leftJoinAndSelect('setorFace.montanha', 'setorFaceMontanha')
            // Setor -> Montanha relations
            .leftJoinAndSelect('setorMontanha.localizacoes', 'setorMontanhaLocalizacoes')
            .leftJoinAndSelect('setorMontanhaLocalizacoes.bairro', 'setorMontanhaBairro')
            // Face relations
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            // Montanha relations
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro');

        if (colecaoId) {
            qb = qb.innerJoin('via.viaColecoes', 'viaColecaoFilter', 'viaColecaoFilter.colecaoId = :colecaoId', { colecaoId })
                .addSelect('viaColecaoFilter.data_adicao', 'data_adicao');
        }

        if (unifiedSearch) {
            qb = qb.andWhere(
                '(via.nome LIKE :unifiedSearch OR setorBairro.nome LIKE :unifiedSearch OR setorFaceBairro.nome LIKE :unifiedSearch OR setorMontanhaBairro.nome LIKE :unifiedSearch OR faceBairro.nome LIKE :unifiedSearch OR montanhaBairro.nome LIKE :unifiedSearch OR montanha.nome LIKE :unifiedSearch OR faceMontanha.nome LIKE :unifiedSearch OR setorMontanha.nome LIKE :unifiedSearch OR setorFaceMontanha.nome LIKE :unifiedSearch)',
                { unifiedSearch: `%${unifiedSearch}%` }
            );
        }

        if (bairro) {
            qb = qb.andWhere(
                '(LOWER(setorBairro.nome) = :bairro OR LOWER(setorFaceBairro.nome) = :bairro OR LOWER(setorMontanhaBairro.nome) = :bairro OR LOWER(faceBairro.nome) = :bairro OR LOWER(montanhaBairro.nome) = :bairro)',
                { bairro: bairro.toLowerCase() }
            );
        }

        if (selectedMountain) {
            qb = qb.andWhere(
                '(montanha.id = :selectedMountain OR faceMontanha.id = :selectedMountain OR setorMontanha.id = :selectedMountain OR setorFaceMontanha.id = :selectedMountain)',
                { selectedMountain }
            );
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
                maxExtension: selectedExtensionCategory[1],
            });
        }

        if (selectedExposicao) {
            if (selectedExposicao[0] === 'e1' && selectedExposicao[1] === 'e2') {
                qb = qb.andWhere('LOWER(via.exposicao) IN (:...selectedExposicao)', { selectedExposicao });
            } else {
                qb = qb.andWhere('via.exposicao LIKE :selectedExposicao', { selectedExposicao: `${selectedExposicao[0]}%` });
            }
        }

        if (tipo_rocha) {
            qb = qb.andWhere('LOWER(via.tipo_rocha) LIKE :tipo_rocha', { tipo_rocha: `%${tipo_rocha.toLowerCase()}%` });
        }

        if (tipo_escalada) {
            qb = qb.andWhere('LOWER(via.tipo_escalada) LIKE :tipo_escalada', { tipo_escalada: `%${tipo_escalada.toLowerCase()}%` });
        }

        if (modalidade) {
            qb = qb.andWhere('via.modalidade = :modalidade', { modalidade });
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
            return { ...item, data_adicao: rawData.data_adicao || null };
        });

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return { items: mappedItems, totalPages, totalItems };
    }

    async countByField(field: string, value: any, operator: string = '='): Promise<number> {
        const queryBuilder = this.repository.createQueryBuilder('via');

        if (field === 'via.exposicao' || field === 'via.duracao') {
            queryBuilder.where(`${field} LIKE :value`, { value: `%${value}%` });
        } else {
            queryBuilder.where(`${field} ${operator} :value`, { value });
        }

        return queryBuilder.getCount();
    }

    async countByBairro(bairro: string): Promise<number> {
        return this.repository.createQueryBuilder('via')
            .leftJoin('via.setor', 'setor')
            .leftJoin('setor.localizacoes', 'setorLocalizacoes')
            .leftJoin('setorLocalizacoes.bairro', 'setorBairro')
            .leftJoin('setor.face', 'setorFace')
            .leftJoin('setorFace.localizacoes', 'setorFaceLocalizacoes')
            .leftJoin('setorFaceLocalizacoes.bairro', 'setorFaceBairro')
            .leftJoin('setor.montanha', 'setorMontanha')
            .leftJoin('setorMontanha.localizacoes', 'setorMontanhaLocalizacoes')
            .leftJoin('setorMontanhaLocalizacoes.bairro', 'setorMontanhaBairro')
            .leftJoin('via.face', 'face')
            .leftJoin('face.localizacoes', 'faceLocalizacoes')
            .leftJoin('faceLocalizacoes.bairro', 'faceBairro')
            .leftJoin('via.montanha', 'montanha')
            .leftJoin('montanha.localizacoes', 'montanhaLocalizacoes')
            .leftJoin('montanhaLocalizacoes.bairro', 'montanhaBairro')
            .where(
                '(LOWER(setorBairro.nome) = :bairro OR LOWER(setorFaceBairro.nome) = :bairro OR LOWER(setorMontanhaBairro.nome) = :bairro OR LOWER(faceBairro.nome) = :bairro OR LOWER(montanhaBairro.nome) = :bairro)',
                { bairro: bairro.toLowerCase() }
            )
            .getCount();
    }
}
