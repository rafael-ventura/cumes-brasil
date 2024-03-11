import { Request, Response, NextFunction } from 'express';

// Middleware de autorização
export function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
    // Verificar se o usuário autenticado tem permissão para acessar o perfil
    if (req.user.id !== req.params.userId) { // <--- Aqui estamos comparando o ID do usuário autenticado com o ID do usuario passado nos parâmetros da requisição
        return res.status(403).json({ error: 'Você não tem permissão para acessar este perfil.' });
    }
    next(); // Se tiver permissão, passa para o próximo middleware
}
