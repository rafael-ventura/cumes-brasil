// controllers/auth.controller.ts

import { Request, Response } from 'express';
import AuthService from '../../Application/services/AuthenticateService';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json({ token });
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            await this.authService.register(email, password);
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }
}

export default AuthController;
