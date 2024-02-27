// services/auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import dbConnection from '../../Infrastructure/config/db';

class AuthService {
    private userRepository: UsuarioRepository;
    private readonly secretKey: string = process.env.SECRET_KEY || '';

    constructor() {
        this.userRepository = new UsuarioRepository(dbConnection);
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('User not found');

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error('Invalid password');

        return this.generateToken(user.id);
    }

    async register(email: string, password: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('Email already registered');

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.create(email, hashedPassword);
    }

    generateToken(userId: string): string {
        return jwt.sign({userId}, this.secretKey);
    }

    verifyToken(token: string): boolean {
        try {
            jwt.verify(token, this.secretKey);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default AuthService;
