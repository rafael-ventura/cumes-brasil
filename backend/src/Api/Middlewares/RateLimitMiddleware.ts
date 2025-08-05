import rateLimit from 'express-rate-limit';
import { safeLogger } from '../../Infrastructure/config/logger';

// Rate limiter geral para todas as rotas
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP por janela de tempo
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    safeLogger.warn('Rate limit excedido', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(429).json({
      error: 'Muitas requisições. Tente novamente em 15 minutos.',
      statusCode: 429
    });
  }
});

// Rate limiter específico para autenticação
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // limite de 5 tentativas de login por IP por janela de tempo
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    safeLogger.warn('Rate limit de autenticação excedido', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(429).json({
      error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
      statusCode: 429
    });
  }
});

// Rate limiter para upload de imagens
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // limite de 10 uploads por IP por hora
  message: {
    error: 'Limite de uploads excedido. Tente novamente em 1 hora.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    safeLogger.warn('Rate limit de upload excedido', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(429).json({
      error: 'Limite de uploads excedido. Tente novamente em 1 hora.',
      statusCode: 429
    });
  }
});

// Rate limiter para criação de conteúdo
export const createContentRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // limite de 20 criações por IP por hora
  message: {
    error: 'Limite de criação de conteúdo excedido. Tente novamente em 1 hora.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    safeLogger.warn('Rate limit de criação de conteúdo excedido', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(429).json({
      error: 'Limite de criação de conteúdo excedido. Tente novamente em 1 hora.',
      statusCode: 429
    });
  }
}); 