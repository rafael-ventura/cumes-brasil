import { Request, Response, NextFunction } from 'express';

// Middleware de autorização
export function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
    next(); // Passa para o próximo middleware
}
