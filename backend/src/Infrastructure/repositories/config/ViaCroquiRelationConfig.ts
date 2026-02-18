import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { createRelationConfig, RelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade ViaCroqui.
 */

/**
 * Relações básicas para associação.
 */
const BASIC_RELATIONS = [
  'via',
  'croqui',
];

/**
 * Relações detalhadas com nested relations.
 */
const DETAILED_RELATIONS = [
  'via.montanha',
  'via.face',
  'via.setor',
  'via.imagem',
  'croqui.imagem',
  'croqui.fonte',
];

/**
 * Configuração de relações por estratégia.
 */
export const ViaCroquiRelationConfig: RelationConfig = createRelationConfig({
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
   * FULL_WITH_ESCALADAS: Igual a FULL para ViaCroqui (sem escaladas próprias)
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_RELATIONS,
    ...DETAILED_RELATIONS,
  ],
});
