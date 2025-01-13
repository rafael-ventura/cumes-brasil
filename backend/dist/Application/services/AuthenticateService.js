"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const UnauthorizedError_1 = __importDefault(require("../errors/UnauthorizedError"));
const constants_1 = require("../errors/constants");
const UserValidation_1 = __importDefault(require("../validations/UserValidation"));
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const InvalidTokenError_1 = __importDefault(require("../errors/InvalidTokenError"));
const GoogleAuthenticateService_1 = __importDefault(require("./GoogleAuthenticateService"));
class AuthService {
    constructor() {
        this.secretKey = "";
        this.userRepository = new UsuarioRepository_1.UsuarioRepository();
        this.googleService = new GoogleAuthenticateService_1.default();
        this.secretKey = process.env.SECRET_KEY || "";
    }
    async login(email, password) {
        UserValidation_1.default.authenticateValidation(email, password);
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new NotFoundError_1.default(constants_1.errorsMessage.USER_MAIL_NOT_FOUND);
        const isValidPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isValidPassword)
            throw new UnauthorizedError_1.default(constants_1.errorsMessage.BAD_CREDENTIALS);
        const token = this.generateToken(user.id.toString());
        return { "token": token, "userId": user.id, auth: true };
    }
    async googleLogin(authorizationCode) {
        if (!authorizationCode) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.GOOGLE_AUTHORIZATION_CODE_INVALID);
        }
        const idToken = await this.googleService.getIdToken(authorizationCode);
        if (!idToken) {
            throw new InvalidTokenError_1.default(constants_1.errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
        }
        const payload = await this.googleService.getPayloadFromToken(idToken);
        const { sub: userId, email, name } = payload;
        if (!userId || !email || !name) {
            throw new InvalidTokenError_1.default(constants_1.errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
        }
        let user = await this.userRepository.findByEmail(email);
        if (!user) {
            const passwordHash = await bcrypt_1.default.hash(idToken, 10);
            await this.userRepository.create(name, email, passwordHash, 3);
            user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new BadRequestError_1.default(constants_1.errorsMessage.USER_NOT_FOUND);
            }
        }
        const token = this.generateToken(user.id.toString());
        return { token, userId: user.id, auth: true };
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.secretKey);
    }
    setSecretKey(secretKey) {
        this.secretKey = secretKey;
    }
}
exports.default = AuthService;
