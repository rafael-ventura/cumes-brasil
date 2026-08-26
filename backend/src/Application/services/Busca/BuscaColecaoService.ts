import { ColecaoRepository } from '../../../Infrastructure/repositories/ColecaoRepository';
import { ColecaoDTO } from '../../../Api/DTOs/Colecao/ColecaoDTO';
import { FiltrosBuscaBase, FiltrosBuscaColecao } from '../../../Domain/interfaces/models/FiltrosBusca';
import UnauthorizedError from '../../errors/UnauthorizedError';
import BadRequestError from '../../errors/BadRequestError';
import { IBuscaTipo, ResultadoBusca } from './IBuscaTipo';

const CAMPOS_ORDENACAO_PERMITIDOS = new Set([
  'nome',
  'created_at',
  'updated_at'
]);

export class BuscaColecaoService implements IBuscaTipo {
  constructor(private readonly repository: ColecaoRepository) {}

  async buscar(filtros: FiltrosBuscaBase): Promise<ResultadoBusca> {
    const filtrosColecao = filtros as FiltrosBuscaColecao;
    this.validar(filtrosColecao);

    const resultado = await this.repository.search(filtrosColecao);

    return {
      items: resultado.items.map(c => new ColecaoDTO(c as any)),
      totalPages: resultado.totalPages,
      totalItems: resultado.totalItems
    };
  }

  private validar(filtros: FiltrosBuscaColecao): void {
    // Coleções são privadas por usuário — exige auth.
    if (!filtros.usuarioId) {
      throw new UnauthorizedError('Busca de coleções requer autenticação');
    }
    if (filtros.campoOrdenacao && !CAMPOS_ORDENACAO_PERMITIDOS.has(filtros.campoOrdenacao)) {
      throw new BadRequestError('Campo de ordenação inválido');
    }
  }
}
