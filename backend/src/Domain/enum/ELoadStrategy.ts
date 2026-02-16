/**
 * Estratégias de carregamento de relações para repositórios.
 * 
 * Segue princípios:
 * - YAGNI: Apenas estratégias necessárias para casos de uso reais
 * - KISS: Nomenclatura clara e objetiva
 * - Performance: Permite otimização de queries por contexto
 * 
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
   * FULL: Carrega absolutamente todas as relações disponíveis.
   * Uso raro, apenas quando necessário ter objeto completo em memória.
   */
  FULL = 'FULL'
}
