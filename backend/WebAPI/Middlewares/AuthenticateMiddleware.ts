import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Adiciona uma propriedade personalizada 'user' à definição de tipo 'Request'
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const secretKey = process.env.SECRET_KEY;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Adiciona o usuário decodificado ao objeto de solicitação para uso posterior
        next();
    });
}
