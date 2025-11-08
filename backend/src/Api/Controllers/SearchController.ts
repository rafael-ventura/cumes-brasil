import { Request, Response } from "express";
import { SearchService } from "../../Application/services/SearchService";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { ISearchResult } from "../../Domain/interfaces/models/ISearchResult";
import {ColecaoRepository} from "../../Infrastructure/repositories/ColecaoRepository";
import {EscaladaRepository} from "../../Infrastructure/repositories/EscaladaRepository";
import SearchValidation from '../../Application/validations/SearchValidation';

export class SearchController {
	private serviceMap: { [key: string]: SearchService<any> };

	constructor() {
		this.serviceMap = {
			'via': new SearchService(new ViaRepository()),
			'montanha': new SearchService(new MontanhaRepository()),
			'colecao': new SearchService<ColecaoRepository>(new ColecaoRepository()),
			'escalada': new SearchService(new EscaladaRepository())
			// Adicione mais serviços para outras entidades conforme necessário
		};
	}

	searchEntities = async (req: Request, res: Response) => {
		const {
			entityType,
			unifiedSearch,
			selectedMountain,
			selectedDifficulty,
			selectedExtensionCategory,
			selectedCrux,
			selectedExposicao,
			colecaoId,
			bairro,
			page,
			itemsPerPage,
			sortField,
			sortOrder
		} = SearchValidation.body(req.body);

		// Obtenha o ID do usuário logado (por exemplo, do middleware de autenticação)
		const usuarioId = req.user?.usuarioId || 0;

		// Construa o objeto de filtros a partir da requisição
		const filters = {
			unifiedSearch,
			selectedMountain,
			selectedDifficulty,
			selectedExtensionCategory,
			selectedCrux,
			selectedExposicao,
			bairro,
			colecaoId,
			usuarioId,
			page,
			itemsPerPage,
			sortField,
			sortOrder
		};

		// Aplique os filtros na consulta ao banco de dados
		const searchResult = await this.serviceMap[entityType].search(filters) as ISearchResult<any>;
		// Adicione o totalItems ao resultado
		res.json({
			items: searchResult.items,
			totalPages: searchResult.totalPages,
			totalItems: searchResult.totalItems,
		});
	};
}
