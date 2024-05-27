"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const google_auth_library_1 = require("google-auth-library");
class AuthService {
    constructor() {
        this.secretKey = "";
        this.userRepository = new UsuarioRepository_1.UsuarioRepository();
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new Error("Nenhum usuário com esse Email encontrado");
        const isValidPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isValidPassword)
            throw new Error("Senha inválida");
        const token = this.generateToken(user.id.toString());
        return { "token": token, "userId": user.id, auth: true };
    }
    async googleLogin(googleToken) {
        if (!googleToken) {
            throw new Error('Token do Google não fornecido');
        }
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            if (!ticket) {
                throw new Error('Ticket não definido');
            }
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Payload não definido');
            }
            const userid = payload['sub'];
            const email = payload['email'];
            const name = payload['name'];
            if (!userid || !email || !name) {
                throw new Error('UserID, Email ou Nome não definidos no payload');
            }
            // Verificar se o usuário já existe
            let user = await this.userRepository.findByEmail(email);
            if (!user) {
                // Criar um novo usuário se necessário
                const passwordHash = await bcrypt_1.default.hash(googleToken, 10);
                await this.userRepository.create(name, email, passwordHash);
                user = await this.userRepository.findByEmail(email);
            }
            if (!user) {
                throw new Error('Não foi possível criar o usuário');
            }
            // Gerar um token JWT para o usuário
            const token = this.generateToken(user.id.toString());
            return { "token": token, "userId": user.id, auth: true };
        }
        catch (error) {
            throw new Error("Erro ao autenticar com o Google: " + error);
        }
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.secretKey);
    }
    setSecretKey(secretKey) {
        this.secretKey = secretKey;
    }
}
function createAuthService() {
    const authService = new AuthService();
    // TODO: verificar pq ele nao está pegando do .env
    authService.setSecretKey(process.env.SECRET_KEY || '8c7515be3e2a107dc0cf543889f045fb7df3177209ebfd0a2b966b6b6d9eb4d7');
    return authService;
}
exports.createAuthService = createAuthService;
exports.default = AuthService;
