// controllers/auth.controller.ts

import { Request, Response } from 'express';
import AuthService, { createAuthService } from '../../Application/services/AuthenticateService';
import NotFoundError from '../../Application/errors/NotFoundError';
import UnauthorizedError from '../../Application/errors/UnauthorizedError';
import { errorsMessage } from '../../Application/errors/constants';
import BadRequestError from '../../Application/errors/BadRequestError';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = createAuthService();
        this.login = this.login.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json({ token });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(error.status).json({
                    message: error.message
                });
            } else if (error instanceof UnauthorizedError) {
                res.status(error.status).json({
                    message: error.message
                });
            } else if (error instanceof BadRequestError) {
                res.status(error.status).json({
                    message: error.message
                });
            } else {
                res.status(500).json({ message: errorsMessage.INTERNAL_SERVER_ERROR });
            }
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
