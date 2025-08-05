import rateLimit from 'express-rate-limit';
import { safeLogger } from '../../Infrastructure/config/logger';
import { getRateLimitConfig, getRateLimitForType, isRateLimitEnabled } from '../../Infrastructure/config/rateLimit';

// Função para criar rate limiter condicional
function createConditionalRateLimiter(type: 'general' | 'auth' | 'upload' | 'createContent') {
  if (!isRateLimitEnabled()) {
    // Retorna middleware que não faz nada se rate limiting estiver desabilitado
    return (req: any, res: any, next: any) => next();
  }

  const config = getRateLimitForType(type);
  
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: {
      error: config.message,
      statusCode: 429
    },
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
      res.status(429).json({
        error: config.message,
        statusCode: 429
      });
    }
  });
}

// Rate limiters condicionais
export const generalRateLimiter = createConditionalRateLimiter('general');
export const authRateLimiter = createConditionalRateLimiter('auth');
export const uploadRateLimiter = createConditionalRateLimiter('upload');
export const createContentRateLimiter = createConditionalRateLimiter('createContent');

// Função para obter informações sobre rate limiting (útil para debugging)
export function getRateLimitInfo() {
  const config = getRateLimitConfig();
  return {
    enabled: config.enabled,
    environment: process.env.NODE_ENV || 'development',
    limits: {
      general: `${config.general.max} req/${config.general.windowMs / 60000}min`,
      auth: `${config.auth.max} req/${config.auth.windowMs / 60000}min`,
      upload: `${config.upload.max} req/${config.upload.windowMs / 60000}min`,
      createContent: `${config.createContent.max} req/${config.createContent.windowMs / 60000}min`
    }
  };
} 