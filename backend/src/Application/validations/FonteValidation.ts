import ValidationBase from "./ValidationBase";

export default {
    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    createBody(fonte: any) {
        ValidationBase.requireObject(fonte);
    },

    updateBody(fonte: any) {
        ValidationBase.requireIdOnBody(fonte);
    }
}


