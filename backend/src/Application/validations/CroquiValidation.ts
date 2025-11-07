import ValidationBase from "./ValidationBase";

export default {
    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    createBody(croqui: any) {
        ValidationBase.requireObject(croqui);
    },

    updateBody(croqui: any) {
        ValidationBase.requireIdOnBody(croqui);
    },

    viaIdQuery(raw: unknown) {
        return ValidationBase.numberParam(raw, 'via_id');
    },

    croquiIdQuery(raw: unknown) {
        return ValidationBase.numberParam(raw, 'croqui_id');
    }
}


