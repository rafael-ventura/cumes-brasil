/**
 * Augmenta o tipo Request do Express com a payload do JWT decodificado
 * pelo authenticateToken / optionalAuthenticateToken.
 */
export interface UsuarioAutenticado {
  usuarioId: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioAutenticado;
    }
  }
}
