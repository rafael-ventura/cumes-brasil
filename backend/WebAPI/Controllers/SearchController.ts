/*
TODO: refazer o acesso ao banco, agora que temos ORM
import { Request, Response } from "express";
import { SearchService } from "../../Application/services/SearchService";
import { Via } from "../../Domain/models/Via";

export class SearchController {
	private service: SearchService;

	constructor(service: SearchService) {
		this.service = service;
	}

	//metodo para fazer a busca de rotas a partir do componente de busca
	searchRoutes = async (req: Request, res: Response) => {
		try {
			const results = await this.service.searchVias(req.query);
			res.json(results);
		} catch (error) {
			res.status(500).json({ error: 'An error occurred while searching for routes.' });
		}
	};
}
*/
