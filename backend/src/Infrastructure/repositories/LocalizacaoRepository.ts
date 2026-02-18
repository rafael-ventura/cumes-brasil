import { Service } from 'typedi';
import { In } from 'typeorm';
import { Localizacao } from '../../Domain/entities/Localizacao';
import BaseRepository from './BaseRepository';
import { RepositoryOptions } from './config/RepositoryOptions';

/**
 * Repository para Localização com suporte a DataLoader
 */
@Service()
export default class LocalizacaoRepository extends BaseRepository<Localizacao> {
    protected entityTarget = Localizacao;

    constructor() {
        super(Localizacao);
    }

    /**
     * Buscar múltiplas localizações por IDs (para DataLoader)
     * 
     * @param ids - Array de IDs
     * @param options - Opções de carregamento (relações)
     * @returns Array de localizações na mesma ordem dos IDs
     */
    async findByIds(
        ids: number[],
        options?: RepositoryOptions<Localizacao>
    ): Promise<Localizacao[]> {
        if (ids.length === 0) return [];

        const qb = this.repository.createQueryBuilder('localizacao')
            .where({ id: In(ids) });

        // Aplicar relações se fornecidas
        if (options?.relations) {
            options.relations.forEach(relation => {
                // Quebrar relação aninhada (ex: 'cidade.estado.pais')
                const parts = relation.split('.');
                let currentAlias = 'localizacao';
                let fullPath = '';

                parts.forEach((part, index) => {
                    fullPath = fullPath ? `${fullPath}.${part}` : part;
                    const joinAlias = parts.slice(0, index + 1).join('_');
                    
                    qb.leftJoinAndSelect(
                        `${currentAlias}.${part}`,
                        joinAlias
                    );
                    
                    currentAlias = joinAlias;
                });
            });
        }

        return qb.getMany();
    }

    /**
     * Override getById para suportar relações nested
     */
    async getById(id: number, options?: RepositoryOptions<Localizacao>): Promise<Localizacao | null> {
        if (!options?.relations) {
            return super.getById(id, options);
        }

        const results = await this.findByIds([id], options);
        return results[0] || null;
    }
}
