import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';

/**
 * Configuração de relações por estratégia de carregamento.
 * 
 * @template T - Tipo da entidade
 */
export type RelationConfig<T = any> = {
  [key in LoadStrategy]: string[];
};

/**
 * Helper para criar configurações de relações com type safety.
 * 
 * @param config - Mapeamento de estratégias para arrays de relações
 * @returns Configuração validada
 * 
 * @example
 * ```typescript
 * const config = createRelationConfig({
 *   [LoadStrategy.MINIMAL]: [],
 *   [LoadStrategy.LIST]: ['montanha', 'imagem'],
 *   [LoadStrategy.DETAIL]: ['montanha', 'face', 'setor', 'imagem', 'fonte'],
 *   [LoadStrategy.FULL]: ['montanha', 'face', 'setor', 'imagem', 'fonte', 'variantes']
 * });
 * ```
 */
export function createRelationConfig<T>(config: RelationConfig<T>): RelationConfig<T> {
  const requiredStrategies = Object.values(LoadStrategy);
  const providedStrategies = Object.keys(config);
  
  const missingStrategies = requiredStrategies.filter(
    strategy => !providedStrategies.includes(strategy)
  );

  if (missingStrategies.length > 0) {
    throw new Error(
      `RelationConfig incompleto. Estratégias faltando: ${missingStrategies.join(', ')}`
    );
  }

  return config;
}

/**
 * Resolve array de relações baseado na estratégia.
 * 
 * @param strategy - Estratégia de carregamento
 * @param config - Configuração de relações
 * @returns Array de strings de relações para TypeORM
 * 
 * @throws Error se estratégia não estiver configurada no RelationConfig
 * 
 * @example
 * ```typescript
 * const relations = resolveRelations(LoadStrategy.LIST, ViaRelationConfig);
 * // Retorna: ['montanha', 'face', 'setor', 'imagem']
 * 
 * const relations = resolveRelations('INVALID', ViaRelationConfig);
 * // Lança: Error: LoadStrategy 'INVALID' não está configurada no RelationConfig...
 * ```
 */
export function resolveRelations<T>(
  strategy: LoadStrategy,
  config: RelationConfig<T>
): string[] {
  const relations = config[strategy];
  
  if (relations === undefined) {
    const availableStrategies = Object.keys(config).join(', ');
    throw new Error(
      `LoadStrategy '${strategy}' não está configurada no RelationConfig. ` +
      `Estratégias disponíveis: ${availableStrategies}. ` +
      `Certifique-se de que o RelationConfig foi criado com createRelationConfig() ` +
      `e contém todas as 4 estratégias obrigatórias (MINIMAL, LIST, DETAIL, FULL).`
    );
  }
  
  return relations;
}
