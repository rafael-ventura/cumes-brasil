import { LoadStrategy } from '../../../Domain/enum/ELoadStrategy';
import { RelationConfig, createRelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade Via.
 */

/**
 * Relações básicas de estrutura física da via.
 */
const BASIC_STRUCTURE_RELATIONS = [
  'montanha',
  'face',
  'setor',
];

/**
 * Relações de mídia e referência.
 */
const MEDIA_RELATIONS = [
  'imagem',
  'fonte',
];

/**
 * Relações de localização - DESABILITADAS TEMPORARIAMENTE
 * 
 * SOLUÇÃO ATUAL: Carregar apenas setor, face, montanha (primeiro nível).
 * Frontend pode fazer requests adicionais se precisar de dados de localização.
 * 
 * SOLUÇÃO FUTURA: Implementar eager loading nas entidades ou usar DataLoader pattern.
 */
const FULL_LOCATION_RELATIONS: string[] = [
  // Relações nested many-to-many removidas temporariamente
  // Para obter localizações, use endpoints específicos:
  // GET /api/setores/:id
  // GET /api/faces/:id  
  // GET /api/montanhas/:id
];

/**
 * Relações de croquis e via principal.
 * Quando carregamos 'viaCroquis', o 'croqui' vem automaticamente.
 */
const CROQUI_RELATIONS = [
  'viaPrincipal',
  'viaCroquis',
];

/**
 * Relações adicionais LEVES (sem escaladas).
 * Use para FULL strategy - carrega variantes e coleções sem sobrecarregar com escaladas.
 */
const ADDITIONAL_RELATIONS_LIGHT = [
  'variantes',
  'viaColecoes',
];

/**
 * Relações adicionais COMPLETAS (incluindo escaladas).
 * Usar apenas quando realmente necessário.
 * Para escaladas, preferir endpoint GET /vias/:id/escaladas?page=1
 */
const ADDITIONAL_RELATIONS_FULL = [
  ...ADDITIONAL_RELATIONS_LIGHT,
  'escaladas',
  'escaladas.usuario', 
];

/**
 * Configuração completa de relações para Via.
 * Cada estratégia compõe relações usando spread operator (DRY).
 */
export const ViaRelationConfig: RelationConfig = createRelationConfig({
  /**
   * MINIMAL: Sem relações.
   * Uso: Contagens, validações, operações que só precisam de campos diretos da via.
   */
  [LoadStrategy.MINIMAL]: [],

  /**
   * LIST: Relações básicas para listagens.
   * Uso: GET /vias, search, listagens em coleções.
   * 
   * Carrega apenas estrutura física básica + imagem.
   */
  [LoadStrategy.LIST]: [
    ...BASIC_STRUCTURE_RELATIONS,
    'imagem',
  ],

  /**
   * DETAIL: Relações completas para visualização detalhada.
   * Uso: GET /vias/:id, create/update responses.
   * 
   * Carrega tudo que ViaDTO precisa para renderizar página de detalhes:
   * - Estrutura física completa com localizações nested
   * - Mídia (imagem, fonte)
   * - Croquis
   * - Via principal
   */
  [LoadStrategy.DETAIL]: [
    ...BASIC_STRUCTURE_RELATIONS,
    ...FULL_LOCATION_RELATIONS,
    ...MEDIA_RELATIONS,
    ...CROQUI_RELATIONS,
  ],

  /**
   * FULL: Todas as relações EXCETO escaladas.
   * Uso: Casos onde precisa de TUDO, mas não de histórico de escaladas.
   * 
   * Inclui relações bidirecionais (variantes, viaColecoes).
   * Escaladas removidas para evitar sobrecarga (podem ser centenas).
   */
  [LoadStrategy.FULL]: [
    ...BASIC_STRUCTURE_RELATIONS,
    ...FULL_LOCATION_RELATIONS,
    ...MEDIA_RELATIONS,
    ...CROQUI_RELATIONS,
    ...ADDITIONAL_RELATIONS_LIGHT,  // ← Sem escaladas
  ],

  /**
   * FULL_WITH_ESCALADAS: Absolutamente TUDO incluindo escaladas.
   * Use com EXTREMA cautela - pode carregar centenas de registros.
   * Preferir paginação: GET /vias/:id/escaladas?page=1&limit=20
   */
  [LoadStrategy.FULL_WITH_ESCALADAS]: [
    ...BASIC_STRUCTURE_RELATIONS,
    ...FULL_LOCATION_RELATIONS,
    ...MEDIA_RELATIONS,
    ...CROQUI_RELATIONS,
    ...ADDITIONAL_RELATIONS_FULL,
  ],
});
