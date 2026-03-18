import { Request, Response } from 'express';
import { LocalizacaoService } from '../../Application/services/LocalizacaoService';
import { NotFoundError } from '../../Application/errors';

export class LocalizacaoController {
  private service: LocalizacaoService;

  constructor(localizacaoService: LocalizacaoService) {
    this.service = localizacaoService;
  }

  getLocationHierarchy = async (_: Request, res: Response) => {
    const result = await this.service.getLocationHierarchy();
    if (!result || result.length === 0) {
      throw new NotFoundError('Nenhuma localização encontrada');
    }
    return res.json(result);
  };

  getStatsForExplorer = async (_: Request, res: Response) => {
    const result = await this.service.getStatsForExplorer();
    if (!result) {
      throw new NotFoundError('Nenhuma estatística encontrada');
    }
    return res.json(result);
  };
}
