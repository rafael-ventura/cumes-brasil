import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { RelationConfig, createRelationConfig } from './RelationConfig';

/**
 * Usuario Relation Configuration
 */

// Basic usuario profile data
const BASIC_USUARIO_RELATIONS = [
    'foto_perfil'
];

// Via preferida with basic structure (no nested locations)
const VIA_PREFERIDA_RELATIONS = [
    'via_preferida',
    'via_preferida.montanha',
    'via_preferida.face',
    'via_preferida.setor',
    'via_preferida.imagem'
];

// Usuario relation configuration
export const UsuarioRelationConfig: RelationConfig<'Usuario'> = createRelationConfig({
    [LoadStrategy.MINIMAL]: [],
    
    [LoadStrategy.LIST]: [
        ...BASIC_USUARIO_RELATIONS
    ],
    
    [LoadStrategy.DETAIL]: [
        ...BASIC_USUARIO_RELATIONS,
        ...VIA_PREFERIDA_RELATIONS
    ],
    
    [LoadStrategy.FULL]: [
        ...BASIC_USUARIO_RELATIONS,
        ...VIA_PREFERIDA_RELATIONS
    ],

    /**
     * FULL_WITH_ESCALADAS: Igual a FULL para Usuário (escaladas carregadas se necessário)
     */
    [LoadStrategy.FULL_WITH_ESCALADAS]: [
        ...BASIC_USUARIO_RELATIONS,
        ...VIA_PREFERIDA_RELATIONS
    ]
});
