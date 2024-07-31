import { EscaladaService } from "../../Application/services/EscaladaService";
import { Request, Response } from "express";
import EscaladaValidation from "../../Domain/interfaces/validations/EscaladaValidation";

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
	getAllEscalada = async (_: Request, res: Response) => {
		try {
			const escaladas = await this.service.get();
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
			escalada.usuarioId = Number(req.user.userId);
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
			const usuarioId = parseInt(req.params.id);
			const result = await this.service.getEscaladasDoUsuario(usuarioId);
			res.json(result);
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
