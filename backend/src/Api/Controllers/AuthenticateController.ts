// controllers/auth.controller.ts

import { NextFunction, Request, Response } from 'express';
import AuthService from '../../Application/services/AuthenticateService';
import HandleErrors from '../../Application/errors/HandleErrors';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
        this.login = this.login.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json({ token });
        } catch (error) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }


    async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorizationCode } = req.body;
            const user = await this.authService.googleLogin(authorizationCode);
            res.json(user);
        } catch (error) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }
}

export default AuthController;
