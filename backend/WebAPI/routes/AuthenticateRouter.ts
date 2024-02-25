// routes/auth.routes.ts

import express from 'express';
import AuthController from "../Controllers/AuthenticateController";

const router = express.Router();
const authController = new AuthController();

// Rota de login
router.post('/login', authController.login);

// Rota de registro
router.post('/register', authController.register);

export default router;
