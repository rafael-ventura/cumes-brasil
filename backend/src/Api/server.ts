import express from 'express';
import helmet from 'helmet';
import routes from './routes/routes';
import 'reflect-metadata';
import { AppDataSource } from '../Infrastructure/config/db';
import { loadData } from '../Infrastructure/initialData/initialLoad';
import { Via } from '../Domain/entities/Via';
import path from 'path';
import { initializeEnvConfig } from '../Infrastructure/config/envinronment';
import { safeLogger } from '../Infrastructure/config/logger';
import { errorRequestMiddleware, notFoundMiddleware } from './Middlewares/ErrorRequestMiddleware';
import { generalRateLimiter, getRateLimitInfo } from './Middlewares/RateLimitMiddleware';
import { corsMiddleware, imageCorsMiddleware } from './Middlewares/CorsMiddleware';

initializeEnvConfig();

const cors = require('cors');
const app = express();
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;
const HOSTNAME = process.env.API_HOSTNAME || '0.0.0.0';
const FRONTEND_URL = process.env.WEB_HOSTNAME || 'http://localhost:9200';

safeLogger.info('Iniciando servidor', {
  frontendUrl: FRONTEND_URL,
  hostname: HOSTNAME,
  port: PORT,
  environment: process.env.NODE_ENV || 'development'
});

// Middlewares de segurança com configuração específica para imagens
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", FRONTEND_URL],
    },
  },
}));

// Rate limiting global (condicional)
app.use(generalRateLimiter);

// Configuração do CORS para todas as rotas
app.use(corsMiddleware);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuração específica para arquivos estáticos com CORS
const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', imageCorsMiddleware, express.static(assetsPath));

safeLogger.info('Servindo arquivos estáticos', { path: assetsPath });

// Rota para verificar configuração de rate limiting (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/rate-limit-info', (req, res) => {
    res.json(getRateLimitInfo());
  });
}

// Rotas da API
app.use('/api', routes);

// Middleware para rotas não encontradas
app.use(notFoundMiddleware);

// Middleware de tratamento de erro global (deve ser o último)
app.use(errorRequestMiddleware);

AppDataSource.initialize()
  .then(async () => {
    safeLogger.info('Conexão com o banco de dados estabelecida com sucesso');
    const viaRepository = AppDataSource.getRepository(Via);
    const count = await viaRepository.count();
    if (count === 0) {
      safeLogger.info('Nenhum registro encontrado na tabela Via, iniciando carga de dados...');
      await loadData();
      safeLogger.info('Carga inicial realizada com sucesso');
    } else {
      safeLogger.info('Registros já existentes na tabela Via, pulando a carga de dados', { count });
    }
  })
  .catch((error) => {
    safeLogger.error('Erro ao conectar com o banco de dados', { 
      error: error.message,
      stack: error.stack 
    });
    process.exit(1);
  });

app.listen(PORT, HOSTNAME, () => {
  const rateLimitInfo = getRateLimitInfo();
  
  safeLogger.info('Servidor iniciado com sucesso', {
    port: PORT,
    hostname: HOSTNAME,
    environment: process.env.NODE_ENV || 'development'
  });
  
  // Log de configurações (sem dados sensíveis)
  safeLogger.info('Configurações do servidor', {
    awsRegion: process.env.AWS_REGION ? 'Configurado' : 'Não configurado',
    awsS3Bucket: process.env.AWS_S3_BUCKET_NAME ? 'Configurado' : 'Não configurado',
    cloudfrontUrl: process.env.CLOUDFRONT_URL ? 'Configurado' : 'Não configurado',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'Não configurado'
  });
  
  // Log de rate limiting
  safeLogger.info('Configuração de Rate Limiting', {
    enabled: rateLimitInfo.enabled,
    environment: rateLimitInfo.environment,
    limits: rateLimitInfo.limits
  });
});
