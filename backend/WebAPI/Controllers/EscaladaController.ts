import { EscaladaService } from "../../Application/services/EscaladaService";
import { Request, Response } from "express";
import { Escalada } from "../../Domain/models/Escalada";
import { UsuarioService } from "../../Application/services/UsuarioService";

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
			const result = await this.service.getEscaladaById(id);
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
	 * @returns {Error} 500 - Erro desconhecido
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getAllEscalada = async (_: Request, res: Response) => {
		try {
			const escaladas: Escalada[] | null = await this.service.getEscaladas();
			res.json(escaladas);
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
	 * @route POST /escaladas
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {object} 201 - Escalada criada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 */
	createEscalada = async (req: Request, res: Response) => {
		try {
			const escalada = req.body;
			await this.service.createEscalada(escalada);
			res.status(201).json({ message: "Escalada criada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "É necessário informar uma via válida para criar uma escalada") {
					res.status(404).json({ error: error.message });
				} else if (error.message === "É necessário informar um usuário válido para criar uma escalada") {
					res.status(400).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
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
			const escalada: Escalada = req.body;
			await this.service.updateEscalada(escalada);
			res.json({ message: "Escala atualizada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Escalada não encontrada") {
					res.status(404).json({ error: error.message });
				} else if (error.message === "É necessário informar uma via válida para criar uma escalada") {
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
	 * @route DELETE /escaladas/:id
	 * @group Escaladas - Operações relacionadas a Escaladas
	 * @returns {object} 200 - Escalada deletada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 * @returns {object} 404 - Escalada não encontrada
	 */
	deleteEscalada = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			await this.service.deleteEscalada(id);
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
	getEscaladasDoUsuario = async (req: Request, res: Response) => {
		try {
			const usuarioId = parseInt(req.params.usuarioId);
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
}
