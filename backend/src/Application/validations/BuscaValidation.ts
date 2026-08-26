import ValidationBase from './ValidationBase';
import BadRequestError from '../errors/BadRequestError';
import { errorsMessage } from '../errors/constants';
import { ehTipoBuscaValido, TipoBusca } from '../services/Busca/BuscaRegistry';

export type CorpoBusca = {
  tipoEntidade: TipoBusca;
  [campo: string]: any;
};

export default {
  body(payload: any): CorpoBusca {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestError(errorsMessage.INVALID_ENTITY_TYPE);
    }
    if (!ehTipoBuscaValido(payload.tipoEntidade)) {
      throw new BadRequestError(errorsMessage.INVALID_ENTITY_TYPE);
    }
    if (payload.pagina !== undefined) {
      ValidationBase.numberParam(payload.pagina, 'pagina');
    }
    if (payload.itensPorPagina !== undefined) {
      ValidationBase.numberParam(payload.itensPorPagina, 'itensPorPagina');
    }
    return payload as CorpoBusca;
  }
};
