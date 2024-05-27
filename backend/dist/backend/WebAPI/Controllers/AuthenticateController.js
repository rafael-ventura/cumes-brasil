"use strict";
// controllers/auth.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticateService_1 = require("../../Application/services/AuthenticateService");
class AuthController {
    constructor() {
        this.authService = (0, AuthenticateService_1.createAuthService)();
        this.login = this.login.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json({ token }); // Retorna o token gerado
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
    async googleLogin(req, res) {
        try {
            const { token } = req.body;
            const user = await this.authService.googleLogin(token);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}
exports.default = AuthController;
