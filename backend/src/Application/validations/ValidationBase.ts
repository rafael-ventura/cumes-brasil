import BadRequestError from "../errors/BadRequestError";
import { errorsMessage } from "../errors/constants";

export default {
    idParam(value: unknown, name = 'id'): number {
        const parsed = Number(value);
        if (value === undefined || value === null || Number.isNaN(parsed)) {
            throw new BadRequestError(`${errorsMessage.PARAM_INVALID}: ${name}`);
        }
        return parsed;
    },

    numberParam(value: unknown, name: string): number {
        const parsed = Number(value);
        if (value === undefined || value === null || Number.isNaN(parsed)) {
            throw new BadRequestError(`${errorsMessage.PARAM_INVALID}: ${name}`);
        }
        return parsed;
    },

    optionalNumberQuery(value: unknown, name: string): number | undefined {
        if (value === undefined || value === null) return undefined;
        const parsed = Number(value);
        if (Number.isNaN(parsed)) {
            throw new BadRequestError(`${errorsMessage.QUERY_NUMERIC_REQUIRED}: ${name}`);
        }
        return parsed;
    },

    pagination(pageRaw?: unknown, limitRaw?: unknown): { page?: number; limit?: number } {
        const out: { page?: number; limit?: number } = {};
        if (pageRaw !== undefined) {
            out.page = this.numberParam(pageRaw, 'page');
        }
        if (limitRaw !== undefined) {
            out.limit = this.numberParam(limitRaw, 'limit');
        }
        return out;
    },

    requireObject(value: unknown, message = errorsMessage.REQUIRED_BODY_OBJECT) {
        if (!value || typeof value !== 'object') {
            throw new BadRequestError(message);
        }
    },

    requireIdOnBody(value: any, message = errorsMessage.REQUIRED_ID_ON_BODY) {
        if (!value || typeof value !== 'object' || !value.id) {
            throw new BadRequestError(message);
        }
    }
}


