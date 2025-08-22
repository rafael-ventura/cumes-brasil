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
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }


    async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorizationCode } = req.body;
            const result = await this.authService.googleLogin(authorizationCode);
            res.json(result);
        } catch (error) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }

    registrar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                nome,
                email,
                senha
            } = req.body;
            const result = await this.authService.register(nome, email, senha);
            res.status(201).json(result);
        } catch (error) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    };

    generateResetUserPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.createResetUserPassword(req.body?.email);
            res.status(200).json({
                message: response.message
            });

        } catch (error: any) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }

    /**
     * Criar lógica para resetar senha do usuario
     */
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.authService.updateUserPassword(req.body?.password, req.body?.passwordRepeated, req.params?.token);
            res.status(201).json({
                message: response.message
            });
        } catch (error: any) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }
}

export default AuthController;
