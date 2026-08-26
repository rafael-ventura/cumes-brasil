import { FiltrosBuscaBase } from '../../../Domain/interfaces/models/FiltrosBusca';

export type ResultadoBusca<T = unknown> = {
  items: T[];
  totalPages: number;
  totalItems: number;
};

/**
 * Contrato comum para os services de busca por tipo de entidade.
 * Cada implementação valida seus próprios filtros, chama o repositório
 * adequado e mapeia o resultado para DTO.
 */
export interface IBuscaTipo {
  buscar(filtros: FiltrosBuscaBase): Promise<ResultadoBusca>;
}
