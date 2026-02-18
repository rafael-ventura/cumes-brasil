import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { RelationConfig, createRelationConfig } from './RelationConfig';

/**
 * Colecao Relation Configuration
*/

// Basic colecao relations
const BASIC_COLECAO_RELATIONS = [
    'usuario',
    'imagem',
    'viaColecoes'  // ← Para contagem de vias (evita N+1)
];

// ViaColecoes with basic via structure (no nested locations)
const VIA_COLECOES_RELATIONS = [
    'viaColecoes',
    'viaColecoes.via',
    'viaColecoes.via.montanha',
    'viaColecoes.via.face',
    'viaColecoes.via.setor',
    'viaColecoes.via.imagem'
];

// Colecao relation configuration
export const ColecaoRelationConfig: RelationConfig<'Colecao'> = createRelationConfig({
    [LoadStrategy.MINIMAL]: [],
    
    [LoadStrategy.LIST]: [
        ...BASIC_COLECAO_RELATIONS
    ],
    
    [LoadStrategy.DETAIL]: [
        ...BASIC_COLECAO_RELATIONS,
        ...VIA_COLECOES_RELATIONS
    ],
    
    [LoadStrategy.FULL]: [
        ...BASIC_COLECAO_RELATIONS,
        ...VIA_COLECOES_RELATIONS
    ],

    /**
     * FULL_WITH_ESCALADAS: Igual a FULL para Coleção (sem escaladas próprias)
     */
    [LoadStrategy.FULL_WITH_ESCALADAS]: [
        ...BASIC_COLECAO_RELATIONS,
        ...VIA_COLECOES_RELATIONS
    ]
});
