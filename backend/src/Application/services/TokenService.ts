import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { UnauthorizedError } from '../errors';

/**
 * Serviço responsável por gerenciar tokens JWT da aplicação.
 */
@Service()
export class TokenService {
    private readonly SECRET_KEY: string;
    private readonly EXPIRES_IN = '1d';

    constructor() {
        this.SECRET_KEY = process.env.JWT_SECRET || process.env.SECRET_KEY || 'secret-key-fallback';
        
        if (!process.env.JWT_SECRET && !process.env.SECRET_KEY) {
            console.warn('JWT_SECRET não configurado. Usando chave padrão (INSEGURO em produção)');
        }
    }

    /**
     * Gera um novo token JWT para o usuário.
     * @param userId - ID do usuário
     * @returns Token JWT assinado
     */
    generate(userId: string): string {
        return jwt.sign(
            { 
                usuarioId: userId,
                type: 'access_token'
            }, 
            this.SECRET_KEY, 
            { 
                expiresIn: this.EXPIRES_IN,
                subject: userId
            }
        );
    }

    /**
     * Valida e decodifica um token JWT.
     * @param token - Token JWT a ser validado
     * @returns Payload decodificado do token
     * @throws UnauthorizedError se o token for inválido ou expirado
     */
    verify(token: string): jwt.JwtPayload {
        try {
            const decoded = jwt.verify(token, this.SECRET_KEY) as jwt.JwtPayload;
            
            if (!decoded || !decoded.usuarioId) {
                throw new UnauthorizedError('Token inválido: payload malformado');
            }
            
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token expirado');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Token inválido');
            }
            throw new UnauthorizedError('Erro ao validar token');
        }
    }

    /**
     * Decodifica um token sem validar a assinatura.
     * Útil apenas para verificar expiração antes de validar.
     * @param token - Token JWT
     * @returns Payload decodificado ou null se inválido
     */
    decode(token: string): jwt.JwtPayload | null {
        try {
            return jwt.decode(token) as jwt.JwtPayload;
        } catch {
            return null;
        }
    }

    /**
     * Verifica se um token está expirado (sem validar assinatura).
     * @param token - Token JWT
     * @returns true se expirado, false caso contrário
     */
    isExpired(token: string): boolean {
        const decoded = this.decode(token);
        if (!decoded || !decoded.exp) return true;
        
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }
}