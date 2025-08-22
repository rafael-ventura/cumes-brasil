import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
import helmet from 'helmet';
import routes from './routes/routes';
import 'reflect-metadata';
import { AppDataSource } from '../Infrastructure/config/db';
import { loadData } from '../Infrastructure/initialData/initialLoad';
import { Via } from '../Domain/entities/Via';
import path from 'path';
import { safeLogger } from '../Infrastructure/config/logger';
import { errorRequestMiddleware, notFoundMiddleware } from './Middlewares/ErrorRequestMiddleware';
import { generalRateLimiter, getRateLimitInfo } from './Middlewares/RateLimitMiddleware';
import { imageCorsMiddleware } from './Middlewares/ImageCorsMiddleware';

const app = express();
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;
const HOSTNAME = process.env.API_HOSTNAME || '0.0.0.0';
// Log inicial de configuração do servidor
safeLogger.info('Iniciando servidor', {
  frontendUrl: process.env.WEB_HOSTNAME,
  hostname: HOSTNAME,
  port: PORT,
  environment: process.env.NODE_ENV
});

/**
 * Segurança básica com Helmet
 * - Controla políticas de conteúdo (CSP)
 * - Permite carregamento de imagens, scripts e estilos externos necessários
 * - Garante configuração mínima de segurança de headers HTTP
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cumesbrasil.com.br"]
    }
  }
}));

// Limitador global de requisições (proteção contra abuso/DDoS simples)
app.use(generalRateLimiter);

// Suporte a JSON e formulários grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Servindo arquivos estáticos (imagens)
 * - Middleware específico de CORS libera acesso público a assets
 * - Pastas servidas diretamente pelo Express
 */
const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', imageCorsMiddleware, express.static(assetsPath));
safeLogger.info('Servindo arquivos estáticos', { path: assetsPath });

/**
 * Endpoint auxiliar (apenas em dev)
 * - Permite inspecionar configurações de rate limiting
 */
if (process.env.NODE_ENV === 'development') {
  app.get('/api/rate-limit-info', (req, res) => {
    res.json(getRateLimitInfo());
  });
}

// Rotas principais da API
app.use('/api', routes);

// Middleware para rotas inexistentes
app.use(notFoundMiddleware);

// Middleware global de tratamento de erros (sempre o último)
app.use(errorRequestMiddleware);

/**
 * Inicialização da base de dados
 * - Conecta no banco via TypeORM
 * - Executa carga inicial se necessário
 */
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

/**
 * Inicialização do servidor HTTP
 * - Exibe logs com configuração básica e limites aplicados
 */
app.listen(PORT, HOSTNAME, () => {
  const rateLimitInfo = getRateLimitInfo();

  safeLogger.info('Servidor iniciado com sucesso', {
    port: PORT,
    hostname: HOSTNAME,
    environment: process.env.NODE_ENV || 'development'
  });

  safeLogger.info('Configurações do servidor', {
    awsRegion: process.env.AWS_REGION ? 'Configurado' : 'Não configurado',
    awsS3Bucket: process.env.AWS_S3_BUCKET_NAME ? 'Configurado' : 'Não configurado',
    cloudfrontUrl: process.env.CLOUDFRONT_URL ? 'Configurado' : 'Não configurado',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'Não configurado'
  });

  safeLogger.info('Configuração de Rate Limiting', {
    enabled: rateLimitInfo.enabled,
    environment: rateLimitInfo.environment,
    limits: rateLimitInfo.limits
  });
});
