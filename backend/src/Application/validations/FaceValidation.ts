import ValidationBase from "./ValidationBase";

export default {
    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    createBody(face: any) {
        ValidationBase.requireObject(face);
    },

    updateBody(face: any) {
        ValidationBase.requireIdOnBody(face);
    }
}


