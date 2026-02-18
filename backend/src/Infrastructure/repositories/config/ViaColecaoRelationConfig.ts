import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { createRelationConfig, RelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade ViaColecao.
 */

/**
 * Relações básicas para exibição em listas de coleções.
 * Carrega via com estrutura mínima para renderizar cards.
 */
const BASIC_RELATIONS = [
  'via',
  'via.montanha',
  'via.face',
  'via.imagem',
];

/**
 * Relações de coleção para contexto completo.
 */
const COLECAO_RELATIONS = [
  'colecao',
  'colecao.usuario',
  'colecao.imagem',
];

/**
 * Configuração de relações por estratégia.
 */
export const ViaColecaoRelationConfig: RelationConfig = createRelationConfig({
  [LoadStrategy.MINIMAL]: [],
  
  [LoadStrategy.LIST]: BASIC_RELATIONS,
  
  [LoadStrategy.DETAIL]: [
    ...BASIC_RELATIONS,
    ...COLECAO_RELATIONS,
  ],
  
  [LoadStrategy.FULL]: [
    ...BASIC_RELATIONS,
    ...COLECAO_RELATIONS,
  ],

  /**
   * FULL_WITH_ESCALADAS: Igual a FULL para ViaColecao (sem escaladas próprias)
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_RELATIONS,
    ...COLECAO_RELATIONS,
  ],
});
