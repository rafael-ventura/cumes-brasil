import BadRequestError from "../errors/BadRequestError"
import { errorsMessage } from "../errors/constants";


export default {
    validate(email: string) {
        if(!email || email.length === 0) {
            throw new BadRequestError(errorsMessage.BAD_CREDENTIALS);
        }
    }
}