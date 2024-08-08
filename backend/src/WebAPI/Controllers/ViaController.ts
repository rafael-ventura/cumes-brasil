import { Request, Response } from 'express';
import { ViaService } from '../../Application/services/ViaService';
import { Via } from '../../Domain/entities/Via';

export class ViaController {
	private service: ViaService;

	constructor(service: ViaService) {
		this.service = service;
	}

	getViaById = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const via = await this.service.getViaById(id);
			console.log("Endpoint GET /vias/:id foi chamado");
			res.status(200).json(via);
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({ error: error.message });
			} else {
				return res.status(500).json({ error: "An unknown error occurred" });
			}
		}
	};

	getAllVia = async (req: Request, res: Response) => {
		try {
			const page = req.query.page ? parseInt(req.query.page as string) : undefined;
			const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
			const result = await this.service.getVias(page, limit);
			console.log('Endpoint GET /vias foi chamado');
			res.status(200).json(result);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: 'Ocorreu um erro desconhecido em controller getAllVia' });
			}
		}
	};

	createVia = async (requisicao: Request, resposta: Response) => {
		try {
			const via: Via = requisicao.body;
			await this.service.createVia(via);
			resposta.status(201).json({ message: "Via criada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "É necessário existir uma Fonte antes da criação da via") {
					return resposta.status(400).json({ error: error.message });
				} else if (error.message === "É necessário existir uma montanha antes da criação da via") {
					return resposta.status(400).json({ error: error.message });
				} else if (error.message === "É necessário existir uma Face antes da criação da via") {
					return resposta.status(400).json({ error: error.message });
				} else if (error.message === "Erro ao criar a via.") {
					return resposta.status(401).json({ error: "Erro provavelmente na escrita sql" });
				} else {
					return resposta.status(500).json({ error: error.message });
				}
			} else {
				return resposta.status(500).json({ error: "Ocorreu um erro desconhecido em controller createVia" });
			}
		}
	};

	updateVia = async (requisicao: Request, resposta: Response) => {
		try {
			const via: Via = requisicao.body;
			await this.service.updateVia(via.id, via);
			resposta.json({ message: "Via atualizada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "É necessário existir uma Fonte antes da criação da via") {
					return resposta.status(400).json({ error: error.message });
				} else if (error.message === "É necessário existir uma montanha antes da criação da via") {
					return resposta.status(400).json({ error: error.message });
				} else if (error.message === "É necessário existir uma Face antes da criação da via") {
					return resposta.status(400).json({ error: error.message });
				} else if (error.message === "Erro ao atualizar via.") {
					return resposta.status(401).json({ error: "Erro provavelmente na consulta escrita sql" });
				} else {
					return resposta.status(500).json({ error: error.message });
				}
			} else {
				return resposta.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateVia" });
			}
		}
	};

	deleteVia = async (requisicao: Request, resposta: Response) => {
		try {
			const id = parseInt(requisicao.params.id);
			await this.service.deleteVia(id);
			resposta.json({ message: "Via deletada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Via não encontrada") {
					return resposta.status(404).json({ error: error.message });
				}
				resposta.status(500).json({ error: error.message });
			}
		}
	};

	getViasInColecao = async (req: Request, res: Response) => {
		try {
			const colecaoId = parseInt(req.params.id);
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			console.log("Endpoint GET /vias/colecao/:id foi chamado", colecaoId, "page", page, "limit", limit);
			const result = await this.service.getViasIdByColecaoId(colecaoId, page, limit);
			res.status(200).json(result);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Nenhuma via encontrada") {
					return res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getViasIn" });
			}
		}
	};

	getViasNotInColecao = async (req: Request, res: Response) => {
		try {
			const colecaoId = parseInt(req.params.id);
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const result = await this.service.getViasNotInColecaoId(colecaoId, page, limit);
			res.status(200).json(result);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Nenhuma via encontrada") {
					return res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getViasNotIn" });
			}
		}
	}
}
