import { NextFunction, Request, Response } from 'express';
import AuthService from '../../Application/services/AuthenticateService';
import UserValidation from '../../Application/validations/UserValidation';
import TokenValidation from '../../Application/validations/TokenValidation';
import { Service } from 'typedi';

@Service()
class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        UserValidation.authenticateValidation(email, password);
        const result = await this.authService.login(email, password);
        res.json(result);
    }


    googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        const { authorizationCode } = req.body;
        if (!authorizationCode) {
            UserValidation.generateResetPasswordValidation(authorizationCode as any);
        }
        const result = await this.authService.googleLogin(authorizationCode);
        res.json(result);
    }

    registrar = async (req: Request, res: Response, next: NextFunction) => {
        const {
            nome,
            email,
            senha
        } = req.body;
        UserValidation.registerValidation(nome, email, senha);
        const result = await this.authService.register(nome, email, senha);
        res.status(201).json(result);
    };

    generateResetUserPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
        UserValidation.generateResetPasswordValidation(req.body?.email);
        const response = await this.authService.createResetUserPassword(req.body?.email);
        res.status(200).json({
            message: response.message
        });
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.params?.token ?? '';
        TokenValidation.resetUserPasswordToken(token);
        UserValidation.resetPasswordValidation(req.body?.password, req.body?.passwordRepeated);
        const response = await this.authService.updateUserPassword(req.body.password, token);
        res.status(201).json({
            message: response.message
        });
    }
}

export default AuthController;
