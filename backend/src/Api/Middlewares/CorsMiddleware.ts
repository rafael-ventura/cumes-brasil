import {Request, Response, NextFunction} from 'express';

const ALLOWED_ORIGINS = new Set([
    'https://www.cumesbrasil.com.br',
    'https://cumesbrasil.com.br',
    'http://localhost:9200',
    'http://localhost:3000',
    'http://localhost:8080',
    process.env.WEB_HOSTNAME || ''
]);

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin ?? '';
    const isAllowed = origin && ALLOWED_ORIGINS.has(origin);

    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // só se precisar de cookies/credenciais
    }
    // Nunca use '*' quando Allow-Credentials=true
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,X-Requested-With');

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
}

export function imageCorsMiddleware(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:9200',
        'http://localhost:3000',
        'http://localhost:8080',
        process.env.WEB_HOSTNAME
    ].filter(Boolean);

    // Para imagens, permite todas as origens
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');

    // Responde imediatamente para requisições OPTIONS
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
} 