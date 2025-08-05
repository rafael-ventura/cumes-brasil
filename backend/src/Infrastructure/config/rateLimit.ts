// Configurações de Rate Limiting
export interface RateLimitConfig {
  enabled: boolean;
  general: {
    windowMs: number;
    max: number;
    message: string;
  };
  auth: {
    windowMs: number;
    max: number;
    message: string;
  };
  upload: {
    windowMs: number;
    max: number;
    message: string;
  };
  createContent: {
    windowMs: number;
    max: number;
    message: string;
  };
}

// Configuração padrão baseada no ambiente
export function getRateLimitConfig(): RateLimitConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Em desenvolvimento, rate limiting mais permissivo ou desabilitado
  if (isDevelopment) {
    return {
      enabled: process.env.RATE_LIMIT_ENABLED === 'true', // Desabilitado por padrão em dev
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 1000, // 1000 requisições por IP (muito mais permissivo)
        message: 'Muitas requisições. Tente novamente em 15 minutos.'
      },
      auth: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 50, // 50 tentativas de login (mais permissivo)
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
      },
      upload: {
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 100, // 100 uploads por hora (mais permissivo)
        message: 'Limite de uploads excedido. Tente novamente em 1 hora.'
      },
      createContent: {
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 200, // 200 criações por hora (mais permissivo)
        message: 'Limite de criação de conteúdo excedido. Tente novamente em 1 hora.'
      }
    };
  }
  
  // Em produção, rate limiting mais restritivo
  if (isProduction) {
    return {
      enabled: true,
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // 100 requisições por IP
        message: 'Muitas requisições. Tente novamente em 15 minutos.'
      },
      auth: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 5, // 5 tentativas de login
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
      },
      upload: {
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 10, // 10 uploads por hora
        message: 'Limite de uploads excedido. Tente novamente em 1 hora.'
      },
      createContent: {
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 20, // 20 criações por hora
        message: 'Limite de criação de conteúdo excedido. Tente novamente em 1 hora.'
      }
    };
  }
  
  // Configuração padrão (teste/outros ambientes)
  return {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    general: {
      windowMs: 15 * 60 * 1000,
      max: 500,
      message: 'Muitas requisições. Tente novamente em 15 minutos.'
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    },
    upload: {
      windowMs: 60 * 60 * 1000,
      max: 50,
      message: 'Limite de uploads excedido. Tente novamente em 1 hora.'
    },
    createContent: {
      windowMs: 60 * 60 * 1000,
      max: 100,
      message: 'Limite de criação de conteúdo excedido. Tente novamente em 1 hora.'
    }
  };
}

// Função para obter configuração específica
export function getRateLimitForType(type: 'general' | 'auth' | 'upload' | 'createContent') {
  const config = getRateLimitConfig();
  return config[type];
}

// Função para verificar se rate limiting está habilitado
export function isRateLimitEnabled(): boolean {
  return getRateLimitConfig().enabled;
} 