import ValidationBase from './ValidationBase';
import BadRequestError from '../errors/BadRequestError';
import { errorsMessage } from '../errors/constants';

const TIPOS_ENTIDADE_PERMITIDOS = ['via', 'colecao', 'escalada'];

export default {
    body(payload: any) {
        if (!payload || !TIPOS_ENTIDADE_PERMITIDOS.includes(payload.tipoEntidade)) {
            throw new BadRequestError(errorsMessage.INVALID_ENTITY_TYPE);
        }
        if (payload.pagina !== undefined) {
            ValidationBase.numberParam(payload.pagina, 'pagina');
        }
        if (payload.itensPorPagina !== undefined) {
            ValidationBase.numberParam(payload.itensPorPagina, 'itensPorPagina');
        }
        return payload;
    }
};
