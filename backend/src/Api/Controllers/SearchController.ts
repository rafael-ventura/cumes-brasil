import { Request, Response } from "express";
import { SearchService } from "../../Application/services/SearchService";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { ISearchResult } from "../../Domain/interfaces/models/ISearchResult";
import {ColecaoRepository} from "../../Infrastructure/repositories/ColecaoRepository";
import {EscaladaRepository} from "../../Infrastructure/repositories/EscaladaRepository";

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
		try {
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
			} = req.body;

			if (!entityType || !this.serviceMap[entityType]) {
				return res.status(400).json({ error: 'Invalid entity type' });
			}

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
		} catch (error) {
			console.error("Error searching entities:", error);
			res.status(500).json({ error: 'An error occurred while searching for entities.' });
		}
	};
}
