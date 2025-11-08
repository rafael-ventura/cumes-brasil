import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de CORS exclusivo para servir arquivos de imagem/estáticos.
 *
 * Por padrão, libera acesso a partir de qualquer origem (`*`),
 * já que imagens públicas geralmente não exigem autenticação.
 *
 * Também define políticas de recursos cruzados para evitar bloqueios
 * em navegadores modernos (CORP/COEP).
 */
export function imageCorsMiddleware(req: Request, res: Response, next: NextFunction) {
    // Libera para qualquer origem (imagens são públicas)
    res.header('Access-Control-Allow-Origin', '*');

    // Métodos suportados para arquivos estáticos
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');

    // Headers permitidos
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Políticas adicionais para permitir carregamento cruzado
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');

    // Responde imediatamente a requisições de pré-verificação (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
}
