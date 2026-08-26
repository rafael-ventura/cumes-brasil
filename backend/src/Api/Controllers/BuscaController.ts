import { Request, Response } from 'express';
import BuscaValidation from '../../Application/validations/BuscaValidation';
import { obterBuscaService } from '../../Application/services/Busca/BuscaRegistry';
import { obterUsuarioIdOpcional } from '../utils/usuarioRequisicao';

export class BuscaController {
  buscar = async (req: Request, res: Response) => {
    const { tipoEntidade, ...filtros } = BuscaValidation.body(req.body);

    const service = obterBuscaService(tipoEntidade);
    const usuarioId = obterUsuarioIdOpcional(req);
    const resultado = await service.buscar({
      ...filtros,
      usuarioId
    });

    res.json(resultado);
  };
}
