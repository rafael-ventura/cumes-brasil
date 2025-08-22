import { Request, Response } from 'express';
import { ViaService } from '../../Application/services/ViaService';
import { Via } from '../../Domain/entities/Via';
import ViaValidation from '../../Application/validations/ViaValidation';
import { ViaDTO } from '../DTOs/Via/ViaDTO';

export class ViaController {
	private service: ViaService;

	constructor(service: ViaService) {
		this.service = service;
	}

	getViaById = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const via = await this.service.getViaById(id);
			return res.status(200).json(new ViaDTO(via));
		} catch (error) {
			if (error instanceof Error && error.message === "Via não encontrada") {
				return res.status(404).json({ message: error.message });
			}
			return res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
		}
	};

	getAllVia = async (req: Request, res: Response) => {
		try {
			const page = req.query.page ? parseInt(req.query.page as string) : undefined;
			const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
			const result = await this.service.getVias(page, limit);

			return res.status(200).json({
				items: result.items.map(v => new ViaDTO(v)),
				total: result.total,
				totalPages: result.totalPages
			});
		} catch (error) {
			return res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
		}
	};

	getRandomVia = async (_: Request, res: Response) => {
		try {
			const via = await this.service.getRandomVia();
			return res.status(200).json(new ViaDTO(via));
		} catch (error) {
			if (error instanceof Error && error.message === "Nenhuma via encontrada") {
				return res.status(404).json({ message: error.message });
			}
			return res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
		}
	};

	createVia = async (req: Request, res: Response) => {
		try {
			const via: Via = req.body;
			const createdVia = await this.service.createVia(via);
			return res.status(201).json(new ViaDTO(createdVia));
		} catch (error) {
			if (error instanceof Error) {
				if ([
					"É necessário existir uma Fonte antes da criação da via",
					"É necessário existir uma montanha antes da criação da via",
					"É necessário existir uma Face antes da criação da via"
				].includes(error.message)) {
					return res.status(400).json({ error: error.message });
				} else if (error.message === "Erro ao criar a via.") {
					return res.status(401).json({ error: "Erro provavelmente na escrita SQL" });
				}
				return res.status(500).json({ error: error.message });
			}
			return res.status(500).json({ error: "Ocorreu um erro desconhecido em controller createVia" });
		}
	};

	updateVia = async (req: Request, res: Response) => {
		try {
			const via: Via = req.body;
			const updatedVia = await this.service.updateVia(via.id, via);
			if (!updatedVia) return res.status(404).json({ message: "Via não encontrada" });

			return res.status(200).json(new ViaDTO(updatedVia));
		} catch (error) {
			if (error instanceof Error) {
				if ([
					"É necessário existir uma Fonte antes da criação da via",
					"É necessário existir uma montanha antes da criação da via",
					"É necessário existir uma Face antes da criação da via"
				].includes(error.message)) {
					return res.status(400).json({ error: error.message });
				} else if (error.message === "Erro ao atualizar via.") {
					return res.status(401).json({ error: "Erro provavelmente na consulta escrita SQL" });
				}
				return res.status(500).json({ error: error.message });
			}
			return res.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateVia" });
		}
	};

	deleteVia = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			await this.service.deleteVia(id);
			res.status(200).json({ message: "Via deletada com sucesso" });
		} catch (error) {
			if (error instanceof Error && error.message === "Via não encontrada") {
				return res.status(404).json({ error: error.message });
			}
			res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
		}
	};

	getViasInColecao = async (req: Request, res: Response) => {
		try {
			const colecaoId = parseInt(req.params.id);
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const result = await this.service.getViasIdByColecaoId(colecaoId, page, limit);

			return res.status(200).json({
				items: result.items.map(v => new ViaDTO(v)),
				total: result.total,
				totalPages: result.totalPages
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Nenhuma via encontrada") {
				return res.status(404).json({ error: error.message });
			}
			res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
		}
	};

	getViasNotInColecao = async (req: Request, res: Response) => {
		try {
			const colecaoId = parseInt(req.params.id);
			const usuarioId = parseInt(req.query.usuarioId as string);
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const result = await this.service.getViasNotInColecaoForUser(colecaoId, usuarioId, page, limit);

			return res.status(200).json({
				items: result.items.map(v => new ViaDTO(v)),
				total: result.total,
				totalPages: result.totalPages
			});
		} catch (error) {
			console.error("Erro em getViasNotInColecao:", error);
			res.status(500).json({ error: "Erro interno no servidor." });
		}
	};

	countEntities = async (req: Request, res: Response) => {
		try {
			const { filter } = req.params;
			const { key, value } = ViaValidation.validaController(filter);

			const totalCount = await this.service.countEntities({ key, value });

			res.status(200).json({ total: totalCount });
		} catch (error) {
			console.error("Erro no countEntities:", error);
			res.status(500).json({ error: "Erro interno no servidor." });
		}
	};
}
