// controllers/auth.controller.ts

import { Request, Response } from 'express';
import AuthService from '../../Application/services/AuthenticateService';
import { createAuthService } from '../../Application/services/AuthenticateService';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = createAuthService();
        this.login = this.login.bind(this);
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json({ token }); // Retorna o token gerado
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }
}

export default AuthController;
