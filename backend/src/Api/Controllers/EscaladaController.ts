import { EscaladaService } from '../../Application/services/EscaladaService';
import { Request, Response } from 'express';
import EscaladaValidation from '../../Application/validations/EscaladaValidation';
import { EscaladaBuscaDTO } from '../DTOs/Escalada/EscaladaBuscaDTO';
import { obterUsuarioIdOpcional } from '../utils/usuarioRequisicao';

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
		const usuarioIdObservador = obterUsuarioIdOpcional(req);
		const escalada = await this.service.getByIdParaObservador(id, usuarioIdObservador);
		if (!escalada) {
			return res.status(404).json({ error: 'Escalada não encontrada' });
		}
		return res.json(new EscaladaBuscaDTO(escalada));
	};

	/**
	 * @route GET /escaladas
	 * @group Escaladas - Operações relacionadas a escaladas
	 * @returns {Array.<Escalada>} 200 - Escaladas encontradas
	 * @returns {object} 404 - Escalada não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getAllEscalada = async (req: Request, res: Response) => {
		const usuarioIdObservador = obterUsuarioIdOpcional(req) ?? 0;
		const viaId = EscaladaValidation.queryInt(req.query.viaId, 'viaId', false);
		const limit = EscaladaValidation.queryInt(req.query.limit, 'limit', false);
		let escaladas;
		const parsedLimit = limit ? Number(limit) : undefined;

		if (viaId !== undefined) {
			escaladas = await this.service.getEscaladasDaVia(viaId, parsedLimit, usuarioIdObservador);
		} else {
			escaladas = await this.service.getAll(parsedLimit, usuarioIdObservador);
		}

		res.json((escaladas ?? []).map(e => new EscaladaBuscaDTO(e as any)));
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
		const id = EscaladaValidation.idParam(req.params.id);
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
		const usuarioObservador = obterUsuarioIdOpcional(req) ?? 0;
		const como = EscaladaValidation.queryComoPerfil(req.query.como);
		EscaladaValidation.validaConflitosQuery(como, viaId);
		/** Registros de terceiros em que o usuário foi marcado na cordada (qualquer papel: guia, participante, misto). */
		const comoMarcado = como === 'marcado' || como === 'participante';

		let escaladas: any[] = [];
		if (viaId !== undefined) {
			escaladas = await this.service.getEscaladasDaViaDoUsuarioParaObservador(
				usuario as number,
				viaId,
				limit as number | undefined,
				usuarioObservador
			);
		} else if (comoMarcado) {
			escaladas = await this.service.getEscaladasOndeUsuarioFoiMarcadoParaObservador(
				usuario as number,
				usuarioObservador
			);
		} else {
			escaladas = await this.service.getEscaladasDoUsuarioParaObservador(usuario as number, usuarioObservador);
		}

		res.json((escaladas ?? []).map(e => new EscaladaBuscaDTO(e as any)));
	};

	getByViaId = async (req: Request, res: Response) => {
		const viaId = EscaladaValidation.idParam(req.params.id);
		const usuarioObservador = obterUsuarioIdOpcional(req) ?? 0;
		const result = await this.service.getEscaladasDaVia(viaId, undefined, usuarioObservador);
		res.json((result ?? []).map(e => new EscaladaBuscaDTO(e as any)));
	};

	getFeed = async (req: Request, res: Response) => {
		const pagina = EscaladaValidation.queryInt(req.query.pagina, 'pagina', false) ?? 1;
		const itensPorPagina = EscaladaValidation.queryInt(req.query.itensPorPagina, 'itensPorPagina', false) ?? 15;
		const result = await this.service.getFeed(pagina, itensPorPagina);
		res.json({
			...result,
			items: (result.items ?? []).map(e => new EscaladaBuscaDTO(e as any))
		});
	};
}
