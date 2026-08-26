// Middlewares/AuthenticateMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { safeLogger } from '../../Infrastructure/config/logger';
import { UnauthorizedError } from '../../Application/errors';

// Função para validar se o token JWT é válido
function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwt.decode(token) as any;
        if (!decoded || !decoded.exp) return true;
        
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Token não fornecido ou inválido');
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verificar se o token está expirado
        if (isTokenExpired(token)) {
            throw new UnauthorizedError('Token expirado');
        }

        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            safeLogger.error('SECRET_KEY não configurada');
            throw new UnauthorizedError('Erro de configuração do servidor');
        }

        const decoded = jwt.verify(token, secretKey);
        if (!decoded || typeof decoded !== 'object' || !('usuarioId' in decoded)) {
            throw new UnauthorizedError('Token inválido');
        }
        req.user = {
            usuarioId: String(decoded.usuarioId),
            iat: decoded.iat,
            exp: decoded.exp
        };
        return next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return res.status(401).json({ 
                error: error.message,
                statusCode: 401
            });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        safeLogger.error('Erro inesperado na autenticação', { error: errorMessage });
        return res.status(500).json({ 
            error: 'Erro interno do servidor',
            statusCode: 500
        });
    }
}

// Middleware opcional para autenticação (não falha se não houver token)
export async function optionalAuthenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Continua sem autenticação
    }
    
    try {
        const token = authHeader.split(' ')[1];
        
        if (isTokenExpired(token)) {
            return next(); // Continua sem autenticação
        }

        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return next(); // Continua sem autenticação
        }

        const decoded = jwt.verify(token, secretKey);
        if (decoded && typeof decoded === 'object' && ('usuarioId' in decoded)) {
            req.user = {
                usuarioId: String(decoded.usuarioId),
                iat: decoded.iat,
                exp: decoded.exp
            };
        }
        return next();
    } catch (error: any) {
        next(); // Continua sem autenticação
    }
}
