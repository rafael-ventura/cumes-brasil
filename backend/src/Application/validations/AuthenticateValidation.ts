import BadRequestError from "../errors/BadRequestError"
import { errorsMessage } from "../errors/constants";


export default {
    valida(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }
    }

}