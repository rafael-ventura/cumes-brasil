import ValidationBase from "./ValidationBase";

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
        ValidationBase.requireIdOnBody(colecao);
    }
}


