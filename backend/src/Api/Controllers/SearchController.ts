import { Request, Response } from 'express';
import { SearchService } from '../../Application/services/SearchService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import SearchValidation from '../../Application/validations/SearchValidation';
import { ViaDTO } from '../DTOs/Via/ViaDTO';
import { FiltrosBuscaBase } from '../../Domain/interfaces/models/FiltrosBusca';

export class SearchController {
	private serviceMap: Record<string, SearchService<any>> = {};

	private getService(tipoEntidade: string): SearchService<any> {
		if (!this.serviceMap[tipoEntidade]) {
			const repositoryMap: Record<string, () => SearchService<any>> = {
				via: () => new SearchService(new ViaRepository()),
				colecao: () => new SearchService(new ColecaoRepository()),
				escalada: () => new SearchService(new EscaladaRepository()),
			};

			const factory = repositoryMap[tipoEntidade];
			if (!factory) {
				throw new Error(`Tipo de entidade não suportado: ${tipoEntidade}`);
			}
			this.serviceMap[tipoEntidade] = factory();
		}
		return this.serviceMap[tipoEntidade];
	}

	searchEntities = async (req: Request, res: Response) => {
		const body = SearchValidation.body(req.body);
		const { tipoEntidade, ...filtrosRest } = body;

		const filtros: FiltrosBuscaBase = {
			...filtrosRest,
			usuarioId: req.user?.usuarioId || 0,
		};

		const service = this.getService(tipoEntidade);
		const resultado = await service.search(filtros);

		const itens = tipoEntidade === 'via'
			? resultado.items.map((item: any) => new ViaDTO(item))
			: resultado.items;

		res.json({
			items: itens,
			totalPages: resultado.totalPages,
			totalItems: resultado.totalItems,
		});
	};
}
