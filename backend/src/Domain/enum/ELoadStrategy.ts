/**
 * Estratégias de carregamento de relações para repositórios.
 * @enum {string}
 */
export enum LoadStrategy {
  /**
   * MINIMAL: Carrega apenas campos básicos da entidade principal.
   * Sem relações. Ideal para contagens, validações e operações simples.
   */
  MINIMAL = 'MINIMAL',

  /**
   * LIST: Carrega relações essenciais para exibição em listagens.
   * Relações de primeiro nível apenas. Otimizado para performance em listas.
   * Exemplo: montanha/face/setor (básicos), imagem.
   */
  LIST = 'LIST',

  /**
   * DETAIL: Carrega todas as relações necessárias para visualização completa.
   * Inclui relações aninhadas e localizações. Ideal para páginas de detalhes.
   */
  DETAIL = 'DETAIL',

  /**
   * FULL: Carrega absolutamente todas as relações disponíveis (exceto escaladas).
   * Uso raro, apenas quando necessário ter objeto completo em memória.
   * Para via: Carrega variantes e viaColecoes, mas NÃO escaladas (use FULL_WITH_ESCALADAS).
   */
  FULL = 'FULL',

  /**
   * FULL_WITH_ESCALADAS: Carrega TODAS as relações incluindo escaladas.
   * Use com EXTREMA cautela - pode carregar centenas de registros.
   * Preferir paginação: GET /vias/:id/escaladas?page=1&limit=20
   */
  FULL_WITH_ESCALADAS = 'FULL_WITH_ESCALADAS'
}
