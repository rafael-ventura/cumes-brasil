import BadRequestError from "../errors/BadRequestError";
import { errorsMessage } from "../errors/constants";

export default {
    validaUsuario(nome: string, email: string, password: string) {
        if (!nome || !email || !password) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }

        if (password.length < 4) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }
    }
}