// services/auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import dbConnection from '../../Infrastructure/config/db';

class AuthService {
    private userRepository: UsuarioRepository;
    private secretKey: string = '';

    constructor() {
        this.userRepository = new UsuarioRepository(dbConnection);
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Nenhum usuário com esse Email encontrado');

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) throw new Error('Senha inválida');

        return this.generateToken(user.id.toString());
    }

    generateToken(userId: string): string {
        return jwt.sign(userId, this.secretKey);
    }

    setSecretKey(secretKey: string) {
        this.secretKey = secretKey;
    }
}

export function createAuthService() {
    const authService = new AuthService();
    authService.setSecretKey(process.env.SECRET_KEY || '');
    return authService;
}

export default AuthService;
