import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';

/**
 * Configuração de relações por estratégia de carregamento.
 * 
 * Type-safe mapping entre LoadStrategy e arrays de relações TypeORM.
 * Permite definir quais relações carregar para cada contexto de uso.
 * 
 * Princípios aplicados:
 * - DRY: Configuração centralizada, evita duplicação de join logic
 * - OCP: Novas estratégias podem ser adicionadas sem modificar código existente
 * - SRP: Separação clara entre configuração e lógica de query
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
  // Valida que todas as estratégias estão definidas
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
 */
export function resolveRelations<T>(
  strategy: LoadStrategy,
  config: RelationConfig<T>
): string[] {
  return config[strategy] || [];
}
