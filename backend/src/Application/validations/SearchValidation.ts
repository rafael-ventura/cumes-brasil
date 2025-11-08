import ValidationBase from "./ValidationBase";
import BadRequestError from "../errors/BadRequestError";
import { errorsMessage } from "../errors/constants";

export default {
    body(payload: any) {
        const allowed = ['via', 'montanha', 'colecao', 'escalada'];
        if (!payload || !allowed.includes(payload.entityType)) {
            throw new BadRequestError(errorsMessage.INVALID_ENTITY_TYPE);
        }
        if (payload.page !== undefined) {
            ValidationBase.numberParam(payload.page, 'page');
        }
        if (payload.itemsPerPage !== undefined) {
            ValidationBase.numberParam(payload.itemsPerPage, 'itemsPerPage');
        }
        return payload;
    }
}


