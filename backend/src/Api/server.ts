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
import { generalRateLimiter } from './Middlewares/RateLimitMiddleware';

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

// Middlewares de segurança
app.use(helmet());

// Rate limiting global
app.use(generalRateLimiter);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', express.static(assetsPath));
safeLogger.info('Servindo arquivos estáticos', { path: assetsPath });

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
});
