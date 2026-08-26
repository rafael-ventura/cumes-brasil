import { EscaladaRepository } from '../../../Infrastructure/repositories/EscaladaRepository';
import { EscaladaBuscaDTO } from '../../../Api/DTOs/Escalada/EscaladaBuscaDTO';
import { FiltrosBuscaBase, FiltrosBuscaEscalada } from '../../../Domain/interfaces/models/FiltrosBusca';
import BadRequestError from '../../errors/BadRequestError';
import { IBuscaTipo, ResultadoBusca } from './IBuscaTipo';

const COMO_PERFIL_PERMITIDOS = new Set(['autor', 'marcado', 'todas']);

export class BuscaEscaladaService implements IBuscaTipo {
  constructor(private readonly repository: EscaladaRepository) {}

  async buscar(filtros: FiltrosBuscaBase): Promise<ResultadoBusca> {
    const filtrosEscalada = filtros as FiltrosBuscaEscalada;
    this.validar(filtrosEscalada);

    const resultado = await this.repository.search(filtrosEscalada);

    return {
      items: resultado.items.map(e => new EscaladaBuscaDTO(e)),
      totalPages: resultado.totalPages,
      totalItems: resultado.totalItems
    };
  }

  private validar(filtros: FiltrosBuscaEscalada): void {
    if (filtros.comoPerfil && !COMO_PERFIL_PERMITIDOS.has(filtros.comoPerfil)) {
      throw new BadRequestError('comoPerfil deve ser autor, marcado ou todas');
    }
  }
}
