import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { createRelationConfig, RelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade Face.
 */

/**
 * Relação essencial - montanha pai.
 */
const BASIC_RELATIONS = [
  'montanha',
];

/**
 * Relações adicionais para contexto completo.
 */
const EXTENDED_RELATIONS = [
  'fonte',
  'localizacao',
  'localizacao.cidade',
  'localizacao.cidade.estado',
  'localizacao.cidade.estado.pais',
];

/**
 * Configuração de relações por estratégia.
 */
export const FaceRelationConfig: RelationConfig = createRelationConfig({
  [LoadStrategy.MINIMAL]: [],
  
  [LoadStrategy.LIST]: BASIC_RELATIONS,
  
  [LoadStrategy.DETAIL]: [
    ...BASIC_RELATIONS,
    ...EXTENDED_RELATIONS,
  ],
  
  [LoadStrategy.FULL]: [
    ...BASIC_RELATIONS,
    ...EXTENDED_RELATIONS,
  ],

  /**
   * FULL_WITH_ESCALADAS: Igual a FULL para Face (sem escaladas próprias)
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_RELATIONS,
    ...EXTENDED_RELATIONS,
  ],
});
