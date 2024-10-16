// controllers/auth.controller.ts

import { NextFunction, Request, Response } from 'express';
import AuthService, { createAuthService } from '../../Application/services/AuthenticateService';
import NotFoundError from '../../Application/errors/NotFoundError';
import UnauthorizedError from '../../Application/errors/UnauthorizedError';
import { errorsMessage } from '../../Application/errors/constants';
import BadRequestError from '../../Application/errors/BadRequestError';
import HandleErrors from '../../Application/errors/HandleErrors';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = createAuthService();
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


    async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body;
            const user = await this.authService.googleLogin(token);
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }
}

export default AuthController;
