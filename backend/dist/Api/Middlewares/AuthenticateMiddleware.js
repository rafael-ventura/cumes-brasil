"use strict";
// Middlewares/AuthenticateMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not provided or invalid' });
    }
    const token = authHeader.split(' ')[1];
    // Tente verificar com a chave secreta primeiro
    jsonwebtoken_1.default.verify(token, '8c7515be3e2a107dc0cf543889f045fb7df3177209ebfd0a2b966b6b6d9eb4d7', (err, decoded) => {
        if (!err) {
            req.user = decoded;
            return next();
        }
        // Se falhar, tente verificar como um ID Token do Google
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        }).then((ticket) => {
            const payload = ticket.getPayload();
            req.user = payload; // Ou extraia informações específicas do payload
            next();
        }).catch((error) => {
            console.error('Erro na verificação do token:', error);
            res.status(403).json({ message: 'Invalid token' });
        });
    });
}
