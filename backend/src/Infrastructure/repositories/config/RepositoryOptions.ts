import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';

/**
 * Opções unificadas para operações de repository.
 * 
 * Elimina necessidade de múltiplos overloads, centralizando parâmetros
 * opcionais em um único objeto type-safe e extensível.
 * 
 * @template T - Tipo da entidade (para type safety futuro)
 * 
 * @example
 * ```typescript
 * // Usando estratégia predefinida (QueryBuilderHelper)
 * const via = await viaRepo.getById(123, { strategy: LoadStrategy.DETAIL });
 * 
 * // Usando relações customizadas (queries complexas)
 * const via = await viaRepo.getById(123, { relations: ['montanha', 'face'] });
 * 
 * // Futuro: Com cache
 * const via = await viaRepo.getById(123, { 
 *   strategy: LoadStrategy.LIST,
 *   cache: 30000 
 * });
 * ```
 */
export interface RepositoryOptions<T = any> {
    /**
     * Estratégia de carregamento de relações (MINIMAL, LIST, DETAIL, FULL).
     * 
     * Usa configuração centralizada do RelationConfig correspondente.
     * Internamente delega para QueryBuilderHelper.applyRelations().
     * 
     * Se especificado junto com `relations`, o `relations` tem prioridade.
     */
    strategy?: LoadStrategy;
    
    /**
     * Array manual de relações para carregar.
     * 
     * Ignora `strategy` se especificado.
     * Útil para casos edge que não se encaixam nas estratégias predefinidas.
     * 
     * @example ['montanha', 'face.localizacoes', 'setor.montanha']
     */
    relations?: string[];
    
    /**
     * Condições WHERE adicionais (futuro).
     * 
     * Permite filtros sem criar métodos especializados.
     * Será implementado em fase posterior.
     */
    where?: Partial<T> | Record<string, any>;
    
    /**
     * Ordenação de resultados (futuro).
     * 
     * Exemplo: { nome: 'ASC', grau: 'DESC' }
     * Será implementado em fase posterior.
     */
    order?: Record<string, 'ASC' | 'DESC'>;
    
    /**
     * Campos específicos para selecionar (futuro).
     * 
     * Otimização para queries que não precisam de toda entidade.
     * Será implementado em fase posterior.
     */
    select?: (keyof T)[];
    
    /**
     * Cache duration em milissegundos (futuro).
     * 
     * Integração com TypeORM query cache.
     * Será implementado em fase posterior.
     * 
     * @example true (usa cache padrão) | 30000 (30 segundos)
     */
    cache?: number | boolean;
}

/**
 * Tipo helper para options de paginação.
 * 
 * Extends RepositoryOptions com campos específicos de paginação.
 * Pode ser usado para métodos getAllPaginated() em versões futuras.
 */
export interface PaginatedRepositoryOptions<T = any> extends RepositoryOptions<T> {
    /**
     * Número da página (1-indexed).
     */
    page: number;
    
    /**
     * Itens por página.
     */
    limit: number;
}
