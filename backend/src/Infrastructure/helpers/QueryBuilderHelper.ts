import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { RelationConfig, resolveRelations } from '../repositories/config/RelationConfig';

/**
 * QueryBuilderHelper - Utilitário centralizado para aplicação de joins
 * 
 * @example
 * ```typescript
 * // No repository:
 * const qb = this.repository.createQueryBuilder("via");
 * QueryBuilderHelper.applyRelations(qb, "via", LoadStrategy.LIST, ViaRelationConfig);
 * ```
 */
export class QueryBuilderHelper {
    /**
     * Contador global para garantir aliases únicos mesmo com relações nested profundas.
     * Necessário porque TypeORM pode ter colisões com aliases automáticos.
     */
    private static aliasCounter = 0;

    /**
     * Aplica relações ao QueryBuilder baseado em LoadStrategy.
     * 
     * Processa relações nested em etapas separadas, pois TypeORM não suporta
     * joins nested diretos como 'entity.relation1.relation2'.
     * 
     * @param queryBuilder - QueryBuilder do TypeORM
     * @param entityAlias - Alias da entidade principal (ex: "via", "usuario")
     * @param strategy - Estratégia de carregamento
     * @param config - Configuração de relações da entidade
     * @returns QueryBuilder com joins aplicados
     * 
     * @example
     * Input: ['viaColecoes.via.montanha']
     * Gera:
     *   1. leftJoinAndSelect('colecao.viaColecoes', 'viaColecoes')
     *   2. leftJoinAndSelect('viaColecoes.via', 'viaColecoes_via')
     *   3. leftJoinAndSelect('viaColecoes_via.montanha', 'viaColecoes_via_montanha')
     */
    static applyRelations<T extends ObjectLiteral>(
        queryBuilder: SelectQueryBuilder<T>,
        entityAlias: string,
        strategy: LoadStrategy,
        config: RelationConfig
    ): SelectQueryBuilder<T> {
        const relations = resolveRelations(strategy, config);

        if (relations.length === 0) {
            return queryBuilder;
        }

        const processedPaths = new Set<string>();

        relations.forEach(relation => {
            const parts = relation.split('.');
            let currentAlias = entityAlias;

            for (let i = 0; i < parts.length; i++) {
                const relationName = parts[i];
                const fullPath = `${currentAlias}.${relationName}`;
                
                if (!processedPaths.has(fullPath)) {
                    const newAlias = `${entityAlias}_${parts.slice(0, i + 1).join('_')}`;
                    
                    queryBuilder.leftJoinAndSelect(fullPath, newAlias);
                    processedPaths.add(fullPath);
                    currentAlias = newAlias;
                } else {
                    currentAlias = `${entityAlias}_${parts.slice(0, i + 1).join('_')}`;
                }
            }
        });

        return queryBuilder;
    }

    /**
     * Gera alias único e legível para uma relação.
     * 
     * Estratégia:
     * - Relações simples: "montanha" → "montanha"
     * - Relações nested: "via_preferida.montanha" → "via_preferida_montanha"
     * - Colisões: adiciona contador "_1", "_2", etc
     * 
     * @param relation - Path da relação (ex: "via_preferida", "setor.localizacoes")
     * @returns Alias único e válido para TypeORM
     * 
     * @example
     * ```typescript
     * generateUniqueAlias("montanha")                    // → "montanha"
     * generateUniqueAlias("via_preferida.montanha")      // → "via_preferida_montanha"
     * generateUniqueAlias("setor.localizacoes.pais")     // → "setor_localizacoes_pais"
     * ```
     */
    private static generateUniqueAlias(relation: string): string {
        const baseAlias = relation.replace(/\./g, '_');
        return baseAlias;
    }

    /**
     * Aplica relações customizadas (array de strings).
     * Usado para manter compatibilidade com assinatura legada string[].
     * 
     * Processa relações nested em etapas separadas (mesma lógica de applyRelations).
     * 
     * @param queryBuilder - QueryBuilder do TypeORM
     * @param entityAlias - Alias da entidade principal
     * @param customRelations - Array de relações customizadas
     * @returns QueryBuilder com joins aplicados
     */
    static applyCustomRelations<T extends ObjectLiteral>(
        queryBuilder: SelectQueryBuilder<T>,
        entityAlias: string,
        customRelations: string[]
    ): SelectQueryBuilder<T> {
        const processedPaths = new Set<string>();

        customRelations.forEach(relation => {
            const parts = relation.split('.');
            let currentAlias = entityAlias;

            for (let i = 0; i < parts.length; i++) {
                const relationName = parts[i];
                const fullPath = `${currentAlias}.${relationName}`;
                
                if (!processedPaths.has(fullPath)) {
                    // Gera alias único com prefixo da entidade principal
                    const newAlias = `${entityAlias}_${parts.slice(0, i + 1).join('_')}`;
                    queryBuilder.leftJoinAndSelect(fullPath, newAlias);
                    processedPaths.add(fullPath);
                    currentAlias = newAlias;
                } else {
                    currentAlias = `${entityAlias}_${parts.slice(0, i + 1).join('_')}`;
                }
            }
        });
        
        return queryBuilder;
    }

    /**
     * Valida se uma relação existe na configuração.     * 
     * @param relation - Relação a validar
     * @param config - Configuração de relações
     * @returns true se relação existe em alguma estratégia
     */
    static isValidRelation(relation: string, config: RelationConfig): boolean {
        const allRelations = Object.values(LoadStrategy).flatMap(strategy =>
            resolveRelations(strategy, config)
        );
        return allRelations.includes(relation);
    }

    /**
     * Retorna todas as relações disponíveis para uma entidade.     * 
     * @param config - Configuração de relações
     * @returns Set de todas as relações únicas
     */
    static getAllRelations(config: RelationConfig): Set<string> {
        const allRelations = Object.values(LoadStrategy).flatMap(strategy =>
            resolveRelations(strategy, config)
        );
        return new Set(allRelations);
    }
}
