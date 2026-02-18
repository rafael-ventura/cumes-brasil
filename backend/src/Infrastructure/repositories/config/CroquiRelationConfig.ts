import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { createRelationConfig, RelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade Croqui.
 */

/**
 * Relações básicas para exibição.
 */
const BASIC_RELATIONS = [
  'imagem',
  'fonte',
];

/**
 * Relações completas incluindo associações.
 */
const FULL_RELATIONS = [
  'viaCroquis',
  'viaCroquis.via',
];

/**
 * Configuração de relações por estratégia.
 */
export const CroquiRelationConfig: RelationConfig = createRelationConfig({
  [LoadStrategy.MINIMAL]: [],
  
  [LoadStrategy.LIST]: BASIC_RELATIONS,
  
  [LoadStrategy.DETAIL]: BASIC_RELATIONS,
  
  [LoadStrategy.FULL]: [
    ...BASIC_RELATIONS,
    ...FULL_RELATIONS,
  ],

  /**
   * FULL_WITH_ESCALADAS: Igual a FULL para Croqui (sem escaladas próprias)
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_RELATIONS,
    ...FULL_RELATIONS,
  ],
});
