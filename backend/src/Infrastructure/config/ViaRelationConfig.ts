import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { RelationConfig, createRelationConfig } from './RelationConfig';

/**
 * Configuração de relações para a entidade Via.
 * 
 * Define quais relações carregar em cada contexto de uso, otimizando
 * performance ao evitar over-fetching de dados desnecessários.
 * 
 * Estratégias:
 * - MINIMAL: Apenas campos da tabela via (sem joins)
 * - LIST: Relações essenciais para listagens (1 nível, sem nested locations)
 * - DETAIL: Todas as relações necessárias para visualização completa
 * - FULL: Absolutamente todas as relações (incluindo variantes e escaladas)
 */

/**
 * Relações básicas de estrutura física da via.
 * Usado como base para outras estratégias (princípio DRY).
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
 * Relações de localização completa (nested).
 * Inclui todo o grafo de localizações: setor → face → montanha com suas respectivas localizações.
 */
const FULL_LOCATION_RELATIONS = [
  // Setor e suas relações
  'setor.localizacoes',
  'setor.localizacoes.continente',
  'setor.localizacoes.pais',
  'setor.localizacoes.regiao',
  'setor.localizacoes.estado',
  'setor.localizacoes.cidade',
  'setor.localizacoes.bairro',
  'setor.face',
  'setor.face.localizacoes',
  'setor.face.localizacoes.continente',
  'setor.face.localizacoes.pais',
  'setor.face.localizacoes.regiao',
  'setor.face.localizacoes.estado',
  'setor.face.localizacoes.cidade',
  'setor.face.localizacoes.bairro',
  'setor.face.montanha',
  'setor.montanha',
  'setor.montanha.localizacoes',
  'setor.montanha.localizacoes.continente',
  'setor.montanha.localizacoes.pais',
  'setor.montanha.localizacoes.regiao',
  'setor.montanha.localizacoes.estado',
  'setor.montanha.localizacoes.cidade',
  'setor.montanha.localizacoes.bairro',
  
  // Face e suas relações
  'face.localizacoes',
  'face.localizacoes.continente',
  'face.localizacoes.pais',
  'face.localizacoes.regiao',
  'face.localizacoes.estado',
  'face.localizacoes.cidade',
  'face.localizacoes.bairro',
  'face.montanha',
  
  // Montanha e suas relações
  'montanha.localizacoes',
  'montanha.localizacoes.continente',
  'montanha.localizacoes.pais',
  'montanha.localizacoes.regiao',
  'montanha.localizacoes.estado',
  'montanha.localizacoes.cidade',
  'montanha.localizacoes.bairro',
];

/**
 * Relações de croquis e via principal.
 */
const CROQUI_RELATIONS = [
  'viaPrincipal',
  'viaCroquis',
  'viaCroquis.croqui',
];

/**
 * Relações adicionais raramente usadas.
 */
const ADDITIONAL_RELATIONS = [
  'variantes',
  'viaColecoes',
  'escaladas',
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
   * NÃO carrega localizações nested (economia de ~40 joins).
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
   * FULL: Absolutamente todas as relações.
   * Uso: Operações especiais que precisam do objeto completamente populado.
   * 
   * Inclui relações bidirecionais (variantes, viaColecoes, escaladas).
   * ⚠️ Use com cautela - pode causar problemas de performance e circular references.
   */
  [LoadStrategy.FULL]: [
    ...BASIC_STRUCTURE_RELATIONS,
    ...FULL_LOCATION_RELATIONS,
    ...MEDIA_RELATIONS,
    ...CROQUI_RELATIONS,
    ...ADDITIONAL_RELATIONS,
  ],
});
