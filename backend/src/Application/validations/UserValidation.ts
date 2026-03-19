import BadRequestError from "../errors/BadRequestError";
import { errorsMessage } from "../errors/constants";

const USERNAME_REGEX = /^[a-z0-9_]{5,30}$/;

export default {
    usernameValidation(username: string) {
        if (!username || typeof username !== 'string') {
            throw new BadRequestError('Username é obrigatório');
        }
        const trimmed = username.trim().toLowerCase();
        if (trimmed.length < 5) {
            throw new BadRequestError('Username deve ter pelo menos 5 caracteres');
        }
        if (trimmed.length > 30) {
            throw new BadRequestError('Username deve ter no máximo 30 caracteres');
        }
        if (!USERNAME_REGEX.test(trimmed)) {
            throw new BadRequestError('Username deve conter apenas letras minúsculas, números e underscore');
        }
        return trimmed;
    },

    registerValidation(nome: string, email: string, password: string, username?: string) {
        if (!nome || !email || !password) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }

        if (password.length < 4) {
            throw new BadRequestError(errorsMessage.BAD_REQUEST);
        }

        if (username) {
            this.usernameValidation(username);
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