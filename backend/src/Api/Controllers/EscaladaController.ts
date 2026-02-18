import { EscaladaService } from '../../Application/services/EscaladaService';
import { Request, Response } from 'express';
import EscaladaValidation from '../../Application/validations/EscaladaValidation';
import { Service } from 'typedi';

@Service()
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
		const id = EscaladaValidation.idParam(req.params.id);
		const result = await this.service.getById(id);
		res.json(result);
	};

	/**
	 * @route GET /escaladas
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {Array.<Escalada>} 200 - Escaladas encontradas
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getAllEscalada = async (req: Request, res: Response) => {
		const viaId = EscaladaValidation.queryInt(req.query.viaId, 'viaId', false);
		const limit = EscaladaValidation.queryInt(req.query.limit, 'limit', false);
		let escaladas;
		const parsedLimit = limit ? Number(limit) : undefined;

		if (viaId !== undefined) {
			escaladas = await this.service.getEscaladasDaVia(viaId, parsedLimit);
		} else {
			escaladas = await this.service.getAll(parsedLimit);
		}

		res.json(escaladas);
	}

	/**
	 * @route POST /escaladas
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {object} 201 - Escalada criada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 */
	createEscalada = async (req: Request, res: Response) => {
		let escalada = req.body;
		EscaladaValidation.valida(escalada);
		await this.service.create(escalada);
		res.status(201).json({ message: "Escalada criado com sucesso" });
	};

	/**
	 * @route PUT /escaladas
	 * @group Escaladas - Operações relacionadas a Escaladas
	 * @returns {object} 200 - Escalada atualizada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 */
	updateEscalada = async (req: Request, res: Response) => {
		const escalada = req.body;
		EscaladaValidation.valida(escalada);
		await this.service.update(escalada);
		res.status(200).json({ message: "Escalada atualizada com sucesso" });
	};

	/**
	 * @route DELETE /escaladas/:id
	 * @group Escaladas - Operações relacionadas a Escaladas
	 * @returns {object} 200 - Escalada deletada com sucesso
	 * @returns {Error} 500 - Erro desconhecido
	 * @returns {object} 404 - Escalada não encontrada
	 */
	deleteEscalada = async (req: Request, res: Response) => {
		const id = parseInt(req.params.id);
		await this.service.delete(id);
		res.status(200).json({ message: "Escalada deletada com sucesso" });
	};

	/**
	 * @route GET /escaladas/:id
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {Array.<Escalada>} 200 - Escaladas encontradas
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getByUsuarioId = async (req: Request, res: Response) => {
		const viaId = EscaladaValidation.queryInt(req.query.viaId, 'viaId', false);
		const limit = EscaladaValidation.queryInt(req.query.limit, 'limit', false);
		const usuario = EscaladaValidation.queryInt(req.query.usuario, 'usuario', true);

		let escaladas: any[] = [];
		if (viaId !== undefined) {
			escaladas = await this.service.getEscaladasDaViaDoUsuario(usuario as number, viaId, limit as number | undefined);
		} else {
			escaladas = await this.service.getEscaladasDoUsuario(usuario as number);
		}

		res.json(escaladas);
	};

	getByViaId = async (req: Request, res: Response) => {
		const viaId = EscaladaValidation.idParam(req.params.id);
		const result = await this.service.getEscaladasDaVia(viaId);
		res.json(result);
	}
}
