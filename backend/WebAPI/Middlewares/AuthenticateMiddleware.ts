import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, '8c7515be3e2a107dc0cf543889f045fb7df3177209ebfd0a2b966b6b6d9eb4d7', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Adiciona o usuário decodificado ao objeto de solicitação para uso posterior
        next();
    });
}
