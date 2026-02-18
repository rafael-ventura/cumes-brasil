import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { createRelationConfig, RelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade Montanha.
 */

/**
 * Relações básicas para exibição.
 */
const BASIC_RELATIONS = [
  'imagem',
];

/**
 * Relações de localização geográfica.
 */
const LOCATION_RELATIONS = [
  'localizacao',
  'localizacao.cidade',
  'localizacao.cidade.estado',
  'localizacao.cidade.estado.pais',
  'localizacao.cidade.estado.pais.continente',
];

/**
 * Configuração de relações por estratégia.
 */
export const MontanhaRelationConfig: RelationConfig = createRelationConfig({
  [LoadStrategy.MINIMAL]: [],
  
  [LoadStrategy.LIST]: BASIC_RELATIONS,
  
  [LoadStrategy.DETAIL]: [
    ...BASIC_RELATIONS,
    ...LOCATION_RELATIONS,
  ],
  
  [LoadStrategy.FULL]: [
    ...BASIC_RELATIONS,
    ...LOCATION_RELATIONS,
  ],

  /**
   * FULL_WITH_ESCALADAS: Igual a FULL para Montanha (sem escaladas próprias)
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_RELATIONS,
    ...LOCATION_RELATIONS,
  ],
});
