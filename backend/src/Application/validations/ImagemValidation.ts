import BadRequestError from "../errors/BadRequestError";
import { Imagem } from "../../Domain/entities/Imagem";
import ValidationBase from "./ValidationBase";

export default {
    idParam(id: unknown) {
        return ValidationBase.idParam(id, 'id');
    },

    createBody(imagem: Imagem) {
        ValidationBase.requireObject(imagem);
    },

    updateBody(imagem: Imagem) {
        ValidationBase.requireIdOnBody(imagem);
    }
}


