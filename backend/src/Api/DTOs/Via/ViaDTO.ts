/**
 * @deprecated Use ViaDetailDTO ou ViaListDTO diretamente.
 * Este export existe apenas para manter compatibilidade com código existente.
 * 
 * ViaDTO é um alias para ViaDetailDTO - mantém 100% compatibilidade backward.
 * 
 * Migração recomendada:
 * - Para listagens: import { ViaListDTO } from './ViaListDTO';
 * - Para detalhes: import { ViaDetailDTO } from './ViaDetailDTO';
 */
export { ViaDetailDTO as ViaDTO } from './ViaDetailDTO';
export { ViaListDTO } from './ViaListDTO';
export { ViaDetailDTO } from './ViaDetailDTO';
