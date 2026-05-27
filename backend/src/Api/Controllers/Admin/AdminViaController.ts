import { Request, Response } from 'express';
import { ViaService } from '../../../Application/services/ViaService';
import { ViaRepository } from '../../../Infrastructure/repositories/ViaRepository';
import { ViaDTO } from '../../DTOs/Via/ViaDTO';
import ViaValidation from '../../../Application/validations/ViaValidation';

const service = new ViaService(new ViaRepository());

export class AdminViaController {
  listar = async (req: Request, res: Response) => {
    const { page = 1, limit = 50 } = req.query;
    const result = await service.getVias(Number(page), Number(limit));
    if (Array.isArray(result)) {
      return res.json({ items: result.map(v => new ViaDTO(v)), total: result.length });
    }
    return res.json({
      items: result.items.map(v => new ViaDTO(v)),
      total: result.total,
      totalPages: result.totalPages
    });
  };

  buscarPorId = async (req: Request, res: Response) => {
    const id = ViaValidation.idParam(req.params.id);
    const via = await service.getViaById(id);
    return res.json(new ViaDTO(via));
  };

  criar = async (req: Request, res: Response) => {
    ViaValidation.createBody(req.body);
    const criada = await service.createVia(req.body);
    return res.status(201).json(new ViaDTO(criada));
  };

  atualizar = async (req: Request, res: Response) => {
    const id = ViaValidation.idParam(req.params.id);
    ViaValidation.updateBody(req.body);
    const atualizada = await service.updateVia(id, req.body);
    return res.json(new ViaDTO(atualizada!));
  };

  deletar = async (req: Request, res: Response) => {
    const id = ViaValidation.idParam(req.params.id);
    await service.deleteVia(id);
    return res.json({ message: 'Via removida com sucesso' });
  };
}
