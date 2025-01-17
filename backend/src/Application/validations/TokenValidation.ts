import BadRequestError from "../errors/BadRequestError"
import { errorsMessage, jwtTokenErrorMessages } from "../errors/constants"
import { Base64 } from "js-base64";
import InvalidTokenError from "../errors/InvalidTokenError";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export default {
    resetUserPasswordToken(token: string) {
        if (!token) {
            throw new BadRequestError(errorsMessage.USER_MAIL_TOKEN_INVALID);
        }
    },

    isBase64Valid(base64Token: string) {
        if (!Base64.isValid(base64Token)) {
            throw new InvalidTokenError(errorsMessage.USER_MAIL_TOKEN_INVALID);
        }
    },

    isJWTValid(jwtToken: string) {
        try {
            return jwt.verify(jwtToken, process.env.SECRET_KEY ? process.env.SECRET_KEY : '') as jwt.JwtPayload;

        } catch (error: JsonWebTokenError | any) {
            if (error instanceof JsonWebTokenError) {
                throw new InvalidTokenError(jwtTokenErrorMessages[error.message]);
            } else {
                throw new InvalidTokenError(errorsMessage.USER_MAIL_TOKEN_INVALID);
            }
        }
    }
}
