import rateLimit from 'express-rate-limit';
import { safeLogger } from '../../Infrastructure/config/logger';

function createRateLimiter(type: 'general' | 'auth' | 'upload' | 'createContent', config: { windowMs: number, max: number, message: string }) {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: { error: config.message, statusCode: 429 },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      safeLogger.warn(`Rate limit ${type} excedido`, {
        ip: req.ip,
        url: req.url,
        method: req.method,
        limit: config.max,
        windowMs: config.windowMs
      });
      res.status(429).json({ error: config.message, statusCode: 429 });
    }
  });
}

// Configurações padrão
const defaultConfig = {
  general: { windowMs: 15 * 60 * 1000, max: 200, message: 'Muitas requisições, tente novamente mais tarde.' },
  auth: { windowMs: 15 * 60 * 1000, max: 20, message: 'Muitas tentativas de login, tente novamente.' },
  upload: { windowMs: 10 * 60 * 1000, max: 10, message: 'Muitos uploads, tente novamente mais tarde.' },
  createContent: { windowMs: 10 * 60 * 1000, max: 30, message: 'Criação de conteúdo limitada, tente novamente.' }
};

// Rate limiters só são aplicados em produção
export const generalRateLimiter = process.env.NODE_ENV === 'production' ? createRateLimiter('general', defaultConfig.general) : (req: any, res: any, next: any) => next();
export const authRateLimiter = process.env.NODE_ENV === 'production' ? createRateLimiter('auth', defaultConfig.auth) : (req: any, res: any, next: any) => next();
export const uploadRateLimiter = process.env.NODE_ENV === 'production' ? createRateLimiter('upload', defaultConfig.upload) : (req: any, res: any, next: any) => next();
export const createContentRateLimiter = process.env.NODE_ENV === 'production' ? createRateLimiter('createContent', defaultConfig.createContent) : (req: any, res: any, next: any) => next();

export function getRateLimitInfo() {
  return {
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV || 'development',
    limits: defaultConfig
  };
}
