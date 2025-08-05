import winston from 'winston';

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cumes-brasil-api' },
  transports: [
    // Log para arquivo de erro
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Log para arquivo combinado
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Se não estiver em produção, log também para console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Função para mascarar dados sensíveis
export function maskSensitiveData(data: any): any {
  if (typeof data === 'string') {
    // Mascara chaves AWS
    return data.replace(/AKIA[0-9A-Z]{16}/g, '***MASKED***')
               .replace(/[0-9a-f]{40}/g, '***MASKED***');
  }
  if (typeof data === 'object' && data !== null) {
    const masked = { ...data };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
    
    for (const key of sensitiveKeys) {
      if (masked[key]) {
        masked[key] = '***MASKED***';
      }
    }
    return masked;
  }
  return data;
}

// Logger customizado que mascara dados sensíveis
export const safeLogger = {
  info: (message: string, meta?: any) => {
    logger.info(message, meta ? maskSensitiveData(meta) : undefined);
  },
  error: (message: string, meta?: any) => {
    logger.error(message, meta ? maskSensitiveData(meta) : undefined);
  },
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta ? maskSensitiveData(meta) : undefined);
  },
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta ? maskSensitiveData(meta) : undefined);
  }
};

export default logger; 