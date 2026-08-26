import { Request, Response } from 'express';
import { ViaService } from '../../Application/services/ViaService';
import { Via } from '../../Domain/entities/Via';
import ViaValidation from '../../Application/validations/ViaValidation';
import { ViaDTO } from '../DTOs/Via/ViaDTO';
import { NotFoundError } from '../../Application/errors';

export class ViaController {
	private service: ViaService;

	constructor(service: ViaService) {
		this.service = service;
	}

	buscarPorId = async (req: Request, res: Response) => {
		const id = ViaValidation.idParam(req.params.id);
		const via = await this.service.buscarPorId(id);
		return res.status(200).json(new ViaDTO(via));
	};

	listar = async (req: Request, res: Response) => {
		const { page, limit } = ViaValidation.pagination(req.query.page, req.query.limit);
		const result = await this.service.listar(page, limit);

		return res.status(200).json({
			items: result.items.map(v => new ViaDTO(v)),
			total: result.total,
			totalPages: result.totalPages
		});
	};

	aleatoria = async (_: Request, res: Response) => {
		const via = await this.service.aleatoria();
		return res.status(200).json(new ViaDTO(via));
	};

	criar = async (req: Request, res: Response) => {
		const via: Via = req.body;
		ViaValidation.createBody(via);
		const criada = await this.service.criar(via);
		return res.status(201).json(new ViaDTO(criada));
	};

	atualizar = async (req: Request, res: Response) => {
		const via: Via = req.body;
		ViaValidation.updateBody(via);
		const atualizada = await this.service.atualizar(via.id, via);
		if (!atualizada) throw new NotFoundError("Via não encontrada");

		return res.status(200).json(new ViaDTO(atualizada));
	};

	deletar = async (req: Request, res: Response) => {
		const id = ViaValidation.idParam(req.params.id);
		await this.service.deletar(id);
		res.status(200).json({ message: "Via deletada com sucesso" });
	};

	listarPorColecao = async (req: Request, res: Response) => {
		const colecaoId = ViaValidation.idParam(req.params.id);
		const { page = 1, limit = 10 } = ViaValidation.pagination(req.query.page, req.query.limit);

		const result = await this.service.listarPorColecao(colecaoId, page, limit);

		return res.status(200).json({
			items: result.items.map(v => new ViaDTO(v)),
			total: result.total,
			totalPages: result.totalPages
		});
	};

	listarForaDeColecao = async (req: Request, res: Response) => {
		const colecaoId = ViaValidation.idParam(req.params.id);
		const usuarioId = ViaValidation.idParam(req.query.usuarioId as string);
		const { page = 1, limit = 10 } = ViaValidation.pagination(req.query.page, req.query.limit);

		const result = await this.service.listarForaDeColecao(colecaoId, usuarioId, page, limit);

		return res.status(200).json({
			items: result.items.map(v => new ViaDTO(v)),
			total: result.total,
			totalPages: result.totalPages
		});
	};

	contarPorFiltro = async (req: Request, res: Response) => {
		const { key, value } = ViaValidation.validaController(req.params.filter);
		const totalCount = await this.service.contarPorFiltro({ key, value });
		res.status(200).json({ total: totalCount });
	};
}
