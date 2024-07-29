import { Request, Response } from "express";
import { SearchService } from "../../Application/services/SearchService";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { ISearchResult } from "../../Domain/interfaces/models/ISearchResult";

export class SearchController {
	private serviceMap: { [key: string]: SearchService<any> };

	constructor() {
		this.serviceMap = {
			'via': new SearchService(new ViaRepository()),
			'montanha': new SearchService(new MontanhaRepository()),
			// Adicione mais serviços para outras entidades conforme necessário
		};
	}

	searchEntities = async (req: Request, res: Response) => {
		try {
			console.log("Search request received: ", req.body);
			const { entityType, searchQuery, selectedMountain, selectedDifficulty, selectedExposure, page, itemsPerPage } = req.body;

			console.log("Search request received: ", req.body);


			if (!entityType || !this.serviceMap[entityType]) {
				return res.status(400).json({ error: 'Invalid entity type' });
			}

			// Construa o objeto de filtros a partir da requisição
			const filters = {
				searchQuery,
				selectedMountain,
				selectedDifficulty,
				selectedExposure,
				page,
				itemsPerPage
			};

			// Aplique os filtros na consulta ao banco de dados
			const searchResult = await this.serviceMap[entityType].search(filters) as ISearchResult<any>;

			console.log("Query result:", searchResult);

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
