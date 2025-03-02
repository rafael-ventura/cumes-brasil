import { EscaladaService } from '../../Application/services/EscaladaService';
import { Request, Response } from 'express';
import EscaladaValidation from '../../Application/validations/EscaladaValidation';

export class EscaladaController {
	private service: EscaladaService;

	constructor(escaladaService: EscaladaService) {
		this.service = escaladaService;
	}

	/**
	 * @route GET /escaladas/:id
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {Escalada.model} 200 - Escalada encontrada
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getEscaladaById = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const result = await this.service.getById(id);
			res.json(result);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Escalada não encontrada") {
					res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}
	};

	/**
	 * @route GET /escaladas
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {Array.<Escalada>} 200 - Escaladas encontradas
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getAllEscalada = async (req: Request, res: Response) => {
		const { viaId, limit } = req.query as { viaId: string, limit: string };
		try {
			let escaladas;
			const parsedLimit = limit ? parseInt(limit, 10) : undefined;

			if (viaId) {
				const parsedViaId = parseInt(viaId, 10);
				escaladas = await this.service.getEscaladasDaVia(parsedViaId, parsedLimit);
			} else {
				escaladas = await this.service.getAll(parsedLimit);
			}

			res.json(escaladas);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Nenhuma escalada encontrada") {
					return res.status(404).json({ message: error.message });
				}
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}

	}

	/**
	 * @route POST /escaladas
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {object} 201 - Escalada criada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 */
	createEscalada = async (req: Request, res: Response) => {
		try {
			let escalada = req.body;
			await this.service.create(escalada);
			res.status(201).json({ message: "Escalada criada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "É necessário informar uma via válida para criar uma escalada") {
					res.status(400).json({ error: error.message });
				} else if (error.message === "É necessário informar um usuário válido para criar uma escalada") {
					res.status(400).json({ error: error.message });
				} else {
					return res.status(404).json({ message: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}
	};

	/**
	 * @route PUT /escaladas
	 * @group Escaladas - Operações relacionadas a Escaladas
	 * @returns {object} 200 - Escalada atualizada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 */
	updateEscalada = async (req: Request, res: Response) => {
		try {
			const escalada = req.body;
			EscaladaValidation.valida(escalada);
			await this.service.update(escalada);
			res.status(200).json({ message: "Escalada atualizada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Escalada não encontrada") {
					res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}

	};

	/**
	 * @route DELETE /escaladas/:id
	 * @group Escaladas - Operações relacionadas a Escaladas
	 * @returns {object} 200 - Escalada deletada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 * @returns {object} 404 - Escalada não encontrada
	 */
	deleteEscalada = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			await this.service.delete(id);
			res.status(200).json({ message: "Escalada deletada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Escalada não encontrada") {
					res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}
	};

	/**
	 * @route GET /escaladas/:id
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {Array.<Escalada>} 200 - Escaladas encontradas
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getByUsuarioId = async (req: Request, res: Response) => {
		try {
			const viaId = req.query.viaId ? parseInt(req.query.viaId as string, 10) : undefined;
			const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
			const usuario = req.query.usuario ? parseInt(req.query.usuario as string, 10) : undefined;

			if (usuario === undefined || isNaN(usuario)) {
				return res.status(400).json({ error: 'Usuário inválido ou não informado.' });
			}

			let escaladas = [];
			if (viaId && !isNaN(viaId)) {
				escaladas = await this.service.getEscaladasDaViaDoUsuario(usuario, viaId, limit);
			} else {
				escaladas = await this.service.getEscaladasDoUsuario(usuario);
			}

			res.json(escaladas);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Nenhuma escalada encontrada para este usuário") {
					res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}
	};

	getByViaId = async (req: Request, res: Response) => {
		try {
			const viaId = parseInt(req.params.id);
			const result = await this.service.getEscaladasDaVia(viaId);
			res.json(result);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Nenhuma escalada encontrada para esta via") {
					res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}
	}
}
