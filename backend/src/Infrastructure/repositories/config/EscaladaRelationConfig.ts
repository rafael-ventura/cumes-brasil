import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { createRelationConfig, RelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade Escalada.
 */

/**
 * Relações básicas para exibição em listas.
 */
const BASIC_RELATIONS = [
  'usuario',
  'via',
];

/**
 * Relações completas incluindo participantes.
 */
const DETAILED_RELATIONS = [
  'participantes',
];

/**
 * Configuração de relações por estratégia.
 */
export const EscaladaRelationConfig: RelationConfig = createRelationConfig({
  [LoadStrategy.MINIMAL]: [],
  
  [LoadStrategy.LIST]: BASIC_RELATIONS,
  
  [LoadStrategy.DETAIL]: [
    ...BASIC_RELATIONS,
    ...DETAILED_RELATIONS,
  ],
  
  [LoadStrategy.FULL]: [
    ...BASIC_RELATIONS,
    ...DETAILED_RELATIONS,
  ],

  /**
   * FULL_WITH_ESCALADAS: Igual a FULL para Escalada (não há sub-escaladas)
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_RELATIONS,
    ...DETAILED_RELATIONS,
  ],
});
