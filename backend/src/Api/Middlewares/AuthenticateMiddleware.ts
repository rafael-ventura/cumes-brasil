import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { safeLogger } from '../../Infrastructure/config/logger';
import { UnauthorizedError } from '../../Application/errors';
import { TokenService } from '../../Application/services/TokenService';

declare global {
    namespace Express {
        interface Request {
            user?: {
                usuarioId: string;
                type: string;
                iat?: number;
                exp?: number;
                sub?: string;
            };
        }
    }
}

/**
 * Extrai token do header Authorization.
 * @param authHeader - Header de autorização
 * @returns Token extraído ou null
 */
function extractToken(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer '
}

/**
 * Middleware de autenticação obrigatória.
 * Valida token JWT e popula req.user com dados do usuário.
 * 
 * @throws UnauthorizedError se token ausente, inválido ou expirado
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractToken(req.headers['authorization']);
        
        if (!token) {
            throw new UnauthorizedError('Token não fornecido');
        }

        const tokenService = Container.get(TokenService);
        const decoded = tokenService.verify(token);
        
        req.user = {
            usuarioId: decoded.usuarioId,
            type: decoded.type || 'access_token',
            iat: decoded.iat,
            exp: decoded.exp,
            sub: decoded.sub
        };
        
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            safeLogger.warn('Tentativa de acesso não autorizado', { 
                path: req.path,
                ip: req.ip,
                error: error.message 
            });
            return res.status(401).json({ 
                error: error.message,
                statusCode: 401
            });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        safeLogger.error('Erro inesperado na autenticação', { 
            path: req.path,
            error: errorMessage 
        });
        
        return res.status(500).json({ 
            error: 'Erro interno do servidor',
            statusCode: 500
        });
    }
}

/**
 * Middleware de autenticação opcional.
 * Valida token se presente, mas não bloqueia se ausente ou inválido.
 * 
 * Útil para rotas que podem funcionar tanto autenticadas quanto não autenticadas
 * (ex: busca pública, mas com recursos extras se autenticado).
 */
export async function optionalAuthenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractToken(req.headers['authorization']);
        
        // Se não há token, continua sem autenticação
        if (!token) {
            return next();
        }

        // Tenta validar token
        const tokenService = Container.get(TokenService);
        
        // Se token expirado, continua sem autenticação (não bloqueia)
        if (tokenService.isExpired(token)) {
            return next();
        }
        
        // Tenta validar
        const decoded = tokenService.verify(token);
        
        // Popula req.user se validação bem-sucedida
        req.user = {
            usuarioId: decoded.usuarioId,
            type: decoded.type || 'access_token',
            iat: decoded.iat,
            exp: decoded.exp,
            sub: decoded.sub
        };
    } catch (error) {
        // Em caso de erro, apenas loga mas continua sem autenticação
        safeLogger.debug('Token opcional inválido, continuando sem autenticação', {
            path: req.path,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    } finally {
        // Sempre continua, com ou sem autenticação
        next();
    }
}
