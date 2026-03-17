import { Request, Response } from "express";
import { SearchService } from "../../Application/services/SearchService";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { ISearchResult } from "../../Domain/interfaces/models/ISearchResult";
import {ColecaoRepository} from "../../Infrastructure/repositories/ColecaoRepository";
import {EscaladaRepository} from "../../Infrastructure/repositories/EscaladaRepository";
import SearchValidation from '../../Application/validations/SearchValidation';
import { ViaDTO } from "../DTOs/Via/ViaDTO";

export class SearchController {
	private serviceMap: { [key: string]: SearchService<any> } = {};

	// Criar repositories de forma lazy (apenas quando necessário, após AppDataSource estar inicializado)
	private getService(entityType: string): SearchService<any> {
		if (!this.serviceMap[entityType]) {
			switch (entityType) {
				case 'via':
					this.serviceMap[entityType] = new SearchService(new ViaRepository());
					break;
				case 'montanha':
					this.serviceMap[entityType] = new SearchService(new MontanhaRepository());
					break;
				case 'colecao':
					this.serviceMap[entityType] = new SearchService<ColecaoRepository>(new ColecaoRepository());
					break;
				case 'escalada':
					this.serviceMap[entityType] = new SearchService(new EscaladaRepository());
					break;
				default:
					throw new Error(`Tipo de entidade não suportado: ${entityType}`);
			}
		}
		return this.serviceMap[entityType];
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
			tipo_rocha,
			tipo_escalada,
			modalidade,
			via_cerj,
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
			tipo_rocha,
			tipo_escalada,
			modalidade,
			via_cerj,
			colecaoId,
			usuarioId,
			page,
			itemsPerPage,
			sortField,
			sortOrder
		};

		// Aplique os filtros na consulta ao banco de dados
		const service = this.getService(entityType);
		const searchResult = await service.search(filters) as ISearchResult<any>;
		
		// Converter para DTOs se for 'via'
		const items = entityType === 'via' 
			? searchResult.items.map((item: any) => new ViaDTO(item))
			: searchResult.items;
		
		// Adicione o totalItems ao resultado
		res.json({
			items: items,
			totalPages: searchResult.totalPages,
			totalItems: searchResult.totalItems,
		});
	};
}
