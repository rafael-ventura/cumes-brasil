"use strict";
// controllers/auth.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticateService_1 = __importDefault(require("../../Application/services/AuthenticateService"));
const HandleErrors_1 = __importDefault(require("../../Application/errors/HandleErrors"));
class AuthController {
    constructor() {
        this.authService = new AuthenticateService_1.default();
        this.login = this.login.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.json({ token });
        }
        catch (error) {
            HandleErrors_1.default.handleErrors(error, req, res, next);
        }
    }
    async googleLogin(req, res, next) {
        try {
            const { authorizationCode } = req.body;
            const user = await this.authService.googleLogin(authorizationCode);
            res.json(user);
        }
        catch (error) {
            HandleErrors_1.default.handleErrors(error, req, res, next);
        }
    }
}
exports.default = AuthController;
