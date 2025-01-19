import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import { OAuth2Client } from "google-auth-library";
import { ObjectLiteral } from "typeorm";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { errorsMessage } from "../errors/constants";
import UserValidation from "../validations/UserValidation";
import BadRequestError from "../errors/BadRequestError";
import InvalidTokenError from "../errors/InvalidTokenError";
import GoogleAuthenticateService from "./GoogleAuthenticateService";

class AuthService {
    private userRepository: UsuarioRepository;
    private secretKey: string = "";
    private googleService: GoogleAuthenticateService;

    constructor() {
        this.userRepository = new UsuarioRepository();
        this.googleService = new GoogleAuthenticateService();
        this.secretKey = process.env.SECRET_KEY || "";
    }

    async login(email: string, password: string): Promise<any> {
        UserValidation.authenticateValidation(email, password);

        const user: ObjectLiteral | null | undefined = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError(errorsMessage.USER_MAIL_NOT_FOUND);

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) throw new UnauthorizedError(errorsMessage.BAD_CREDENTIALS);

        const token = this.generateToken(user.id.toString());

        return { "token": token, "usuarioId": user.id, auth: true };
    }

    async googleLogin(authorizationCode: string): Promise<any> {
        if (!authorizationCode) {
            throw new BadRequestError(errorsMessage.GOOGLE_AUTHORIZATION_CODE_INVALID);
        }

        const idToken = await this.googleService.getIdToken(authorizationCode);

        if (!idToken) {
            throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
        }

        const payload = await this.googleService.getPayloadFromToken(idToken);
        const { sub: usuarioId, email, name } = payload;

        if (!usuarioId || !email || !name) {
            throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
        }

        let user = await this.userRepository.findByEmail(email);
        if (!user) {
            const passwordHash = await bcrypt.hash(idToken, 10);
            await this.userRepository.create(name, email, passwordHash, 3);
            user = await this.userRepository.findByEmail(email);

            if (!user) {
                throw new BadRequestError(errorsMessage.USER_NOT_FOUND);
            }
        }

        const token = this.generateToken(user.id.toString());

        return { token, usuarioId: user.id, auth: true };
    }

    generateToken(usuarioId: string): string {
        return jwt.sign({ usuarioId: usuarioId }, this.secretKey);
    }

    setSecretKey(secretKey: string) {
        this.secretKey = secretKey;
    }
}


export default AuthService;
