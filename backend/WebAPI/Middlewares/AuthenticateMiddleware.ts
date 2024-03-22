// Middlewares/AuthenticateMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// Adiciona uma propriedade personalizada 'user' à definição de tipo 'Request'
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not provided or invalid' });
    }
    const token = authHeader.split(' ')[1];

    // Tente verificar com a chave secreta primeiro
    jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
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
