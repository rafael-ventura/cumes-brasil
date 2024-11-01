import BadRequestError from "../errors/BadRequestError";
import { errorsMessage } from "../errors/constants";

export default {
    registerValidation(nome: string, email: string, password: string) {
        if (!nome || !email || !password) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }

        if (password.length < 4) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }
    },

    authenticateValidation(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }
    },

    generateResetPasswordValidation(email: string) {
        if (!email || email.length === 0) {
            throw new BadRequestError(errorsMessage.BAD_CREDENTIALS);
        }
    },

    resetPasswordValidation(newPassword: string, newPasswordRepeated: string) {
        if (!newPassword || !newPasswordRepeated) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }

        if (newPassword !== newPasswordRepeated) {
            throw new BadRequestError(errorsMessage.BAD_CREDENTIALS);
        }
    }

}