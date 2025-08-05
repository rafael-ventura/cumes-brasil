// Middlewares/AuthenticateMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { safeLogger } from '../../Infrastructure/config/logger';
import { UnauthorizedError } from '../../Application/errors';

// Adiciona uma propriedade personalizada 'user' à definição de tipo_entidade 'Request'
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

        // Tente verificar com a chave secreta primeiro
        jwt.verify(token, secretKey, (err, decoded) => {
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
                req.user = payload;
                next();
            }).catch((error) => {
                safeLogger.error('Erro na verificação do token Google', { error: error.message });
                throw new UnauthorizedError('Token inválido');
            });
        });
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

        jwt.verify(token, secretKey, (err, decoded) => {
            if (!err) {
                req.user = decoded;
                return next();
            }

            // Tenta verificar como token Google
            client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            }).then((ticket) => {
                const payload = ticket.getPayload();
                req.user = payload;
                next();
            }).catch(() => {
                next(); // Continua sem autenticação
            });
        });
    } catch (error: any) {
        next(); // Continua sem autenticação
    }
}
