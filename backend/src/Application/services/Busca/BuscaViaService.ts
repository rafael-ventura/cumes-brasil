import { ViaRepository } from '../../../Infrastructure/repositories/ViaRepository';
import { ViaDTO } from '../../../Api/DTOs/Via/ViaDTO';
import { FiltrosBuscaBase, FiltrosBuscaVia } from '../../../Domain/interfaces/models/FiltrosBusca';
import BadRequestError from '../../errors/BadRequestError';
import { IBuscaTipo, ResultadoBusca } from './IBuscaTipo';

const CAMPOS_ORDENACAO_PERMITIDOS = new Set([
  'nome',
  'grau',
  'extensao',
  'data',
  'created_at',
  'updated_at'
]);

export class BuscaViaService implements IBuscaTipo {
  constructor(private readonly repository: ViaRepository) {}

  async buscar(filtros: FiltrosBuscaBase): Promise<ResultadoBusca> {
    const filtrosVia = filtros as FiltrosBuscaVia;
    this.validar(filtrosVia);

    const resultado = await this.repository.search(filtrosVia);

    return {
      items: resultado.items.map(via => new ViaDTO(via as any)),
      totalPages: resultado.totalPages,
      totalItems: resultado.totalItems
    };
  }

  private validar(filtros: FiltrosBuscaVia): void {
    if (filtros.campoOrdenacao && !CAMPOS_ORDENACAO_PERMITIDOS.has(filtros.campoOrdenacao)) {
      throw new BadRequestError('Campo de ordenação inválido');
    }
    if (filtros.faixaExtensao && (!Array.isArray(filtros.faixaExtensao) || filtros.faixaExtensao.length !== 2)) {
      throw new BadRequestError('faixaExtensao deve ser um array [min, max]');
    }
  }
}
