import BadRequestError from "../errors/BadRequestError";
import ValidationBase from "./ValidationBase";

export default {
    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    updateBody(usuario: any) {
        ValidationBase.requireIdOnBody(usuario);
    },

    editarDados(usuarioDados: any) {
        ValidationBase.requireObject(usuarioDados);
    },

    editarFoto(file: Express.Multer.File | undefined) {
        if (!file) {
            throw new BadRequestError("Campos obrigatórios não preenchidos corretamente");
        }
    }
}


