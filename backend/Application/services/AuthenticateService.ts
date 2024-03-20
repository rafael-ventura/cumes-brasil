// services/AuthenticateService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import dbConnection from '../../Infrastructure/config/db';
import https from 'https';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

class AuthService {
    private userRepository: UsuarioRepository;
    private secretKey: string = '';
    private client: OAuth2Client

    constructor() {
        this.userRepository = new UsuarioRepository(dbConnection);
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async login(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Nenhum usuário com esse Email encontrado');

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) throw new Error('Senha inválida');

        const token = this.generateToken(user.id.toString());

        return {"token": token, "userId": user.id, auth: true};
    }

    async googleLogin(googleToken: string): Promise<any> {
        console.log("Token do Google recebido no Service:", googleToken);

        if (!googleToken) {
            throw new Error('Token do Google não fornecido');
        }

        try {
            const ticket = await this.client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            console.log("Ticket:", ticket);

            if (!ticket) {
                throw new Error('Ticket não definido');
            }

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Payload não definido');
            }

            console.log("Payload: ", payload);

            const userid = payload['sub'];
            console.log("UserID:", userid);
            const email = payload['email'];
            const name = payload['name'];

            if (!userid || !email || !name) {
                throw new Error('UserID, Email ou Nome não definidos no payload');
            }

            if (typeof email !== 'string' || typeof name !== 'string') {
                throw new Error('Email ou nome não definidos no payload');
            }

            console.log("UserID:", userid, "Email:", email, "Name:", name);

            // Verificar se o usuário já existe
            let user = await this.userRepository.findByEmail(email);
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

            console.log("Token gerado:", token, "UserID:", user.id)

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

    async logout() {
        return;
    }
}

export function createAuthService() {
    const authService = new AuthService();
    authService.setSecretKey(process.env.SECRET_KEY || '');
    return authService;
}

export default AuthService;
