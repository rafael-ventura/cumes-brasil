import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import { OAuth2Client } from "google-auth-library";
import { ObjectLiteral } from "typeorm";

class AuthService {
    private userRepository: UsuarioRepository;
    private secretKey: string = "";
    private client: OAuth2Client;

    constructor () {
        this.userRepository = new UsuarioRepository();
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async login (email: string, password: string): Promise<any> {
        const user: ObjectLiteral | null | undefined = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("Nenhum usuário com esse Email encontrado");

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) throw new Error("Senha inválida");

        const token = this.generateToken(user.id.toString());

        return {"token": token, "userId": user.id, auth: true};
    }

    async googleLogin(googleToken: string): Promise<any> {
        if (!googleToken) {
            throw new Error('Token do Google não fornecido');
        }

        try {
            const ticket = await this.client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            if (!ticket) {
                throw new Error("Ticket não definido");
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
            let user: ObjectLiteral | null | undefined = await this.userRepository.findByEmail(email);
            if (!user) {
                // Criar um novo usuário se necessário
                const passwordHash = await bcrypt.hash(googleToken, 10);
                await this.userRepository.create(name, email, passwordHash);
                user = await this.userRepository.findByEmail(email);
            }

            if (!user) {
                throw new Error('Não foi possível criar o usuário');
            }

            // Gerar um token JWT para o usuário
            const token = this.generateToken(user.id.toString());

            return {"token": token, "userId": user.id, auth: true};
        } catch (error) {
            throw new Error("Erro ao autenticar com o Google: " + error);
        }
    }

    generateToken(userId: string): string {
        return jwt.sign({userId}, this.secretKey);
    }


    setSecretKey(secretKey: string) {
        this.secretKey = secretKey;
    }
}

export function createAuthService() {
    const authService = new AuthService();
    // TODO: verificar pq ele nao está pegando do .env
    authService.setSecretKey(process.env.SECRET_KEY || '8c7515be3e2a107dc0cf543889f045fb7df3177209ebfd0a2b966b6b6d9eb4d7');
    return authService;
}

export default AuthService;
