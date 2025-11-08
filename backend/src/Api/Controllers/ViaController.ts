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

	getViaById = async (req: Request, res: Response) => {
		const id = ViaValidation.idParam(req.params.id);
		const via = await this.service.getViaById(id);
		return res.status(200).json(new ViaDTO(via));
	};

	getAllVia = async (req: Request, res: Response) => {
		const { page, limit } = ViaValidation.pagination(req.query.page, req.query.limit);
		const result = await this.service.getVias(page, limit);

		return res.status(200).json({
			items: result.items.map(v => new ViaDTO(v)),
			total: result.total,
			totalPages: result.totalPages
		});
	};

	getRandomVia = async (_: Request, res: Response) => {
		const via = await this.service.getRandomVia();
		return res.status(200).json(new ViaDTO(via));
	};

	createVia = async (req: Request, res: Response) => {
		const via: Via = req.body;
		ViaValidation.createBody(via);
		const createdVia = await this.service.createVia(via);
		return res.status(201).json(new ViaDTO(createdVia));
	};

	updateVia = async (req: Request, res: Response) => {
		const via: Via = req.body;
		ViaValidation.updateBody(via);
		const updatedVia = await this.service.updateVia(via.id, via);
		if (!updatedVia) throw new NotFoundError("Via não encontrada");

		return res.status(200).json(new ViaDTO(updatedVia));
	};

	deleteVia = async (req: Request, res: Response) => {
		const id = ViaValidation.idParam(req.params.id);
		await this.service.deleteVia(id);
		res.status(200).json({ message: "Via deletada com sucesso" });
	};

	getViasInColecao = async (req: Request, res: Response) => {
		const colecaoId = ViaValidation.idParam(req.params.id);
		const { page = 1, limit = 10 } = ViaValidation.pagination(req.query.page, req.query.limit);

	 const result = await this.service.getViasIdByColecaoId(colecaoId, page, limit);

		return res.status(200).json({
			items: result.items.map(v => new ViaDTO(v)),
			total: result.total,
			totalPages: result.totalPages
		});
	};

	getViasNotInColecao = async (req: Request, res: Response) => {
		const colecaoId = ViaValidation.idParam(req.params.id);
		const usuarioId = ViaValidation.idParam(req.query.usuarioId as string);
		const { page = 1, limit = 10 } = ViaValidation.pagination(req.query.page, req.query.limit);

		const result = await this.service.getViasNotInColecaoForUser(colecaoId, usuarioId, page, limit);

		return res.status(200).json({
			items: result.items.map(v => new ViaDTO(v)),
			total: result.total,
			totalPages: result.totalPages
		});
	};

	countEntities = async (req: Request, res: Response) => {
		const { key, value } = ViaValidation.validaController(req.params.filter);
		const totalCount = await this.service.countEntities({ key, value });
		res.status(200).json({ total: totalCount });
	};
}
