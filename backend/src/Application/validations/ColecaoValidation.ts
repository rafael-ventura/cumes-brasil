import ValidationBase from "./ValidationBase";
import BadRequestError from "../errors/BadRequestError";

export default {
    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    pagination(pageRaw?: unknown, limitRaw?: unknown) {
        return ValidationBase.pagination(pageRaw, limitRaw);
    },

    usuarioIdQuery(raw: unknown, required = true) {
        if (!required && (raw === undefined || raw === null)) return undefined;
        return ValidationBase.numberParam(raw, 'usuarioId');
    },

    viaIdQuery(raw: unknown) {
        return ValidationBase.numberParam(raw, 'via_id');
    },

    colecaoIdQuery(raw: unknown) {
        return ValidationBase.numberParam(raw, 'colecao_id');
    },

    createBody(colecao: any) {
        ValidationBase.requireObject(colecao);
    },

    updateBody(colecao: any) {
        ValidationBase.requireObject(colecao);
        // O id vem da URL, não precisa estar no body
    },

    viaIdsBody(body: any): number[] {
        ValidationBase.requireObject(body);
        const raw = body.viaIds;
        if (!Array.isArray(raw) || raw.length === 0) {
            throw new BadRequestError("viaIds deve ser um array não vazio.");
        }
        return raw.map((x: unknown, i: number) =>
            ValidationBase.numberParam(x, `viaIds[${i}]`)
        );
    },

    removerViasLoteBody(body: any): { colecaoId: number; viaIds: number[] } {
        ValidationBase.requireObject(body);
        const colecaoId = ValidationBase.numberParam(body.colecaoId, "colecaoId");
        const raw = body.viaIds;
        if (!Array.isArray(raw) || raw.length === 0) {
            throw new BadRequestError("viaIds deve ser um array não vazio.");
        }
        const viaIds = raw.map((x: unknown, i: number) =>
            ValidationBase.numberParam(x, `viaIds[${i}]`)
        );
        return { colecaoId, viaIds };
    }
}


