import express from 'express';
import dotenv from 'dotenv';

dotenv.config({path: `.env.${process.env.NODE_ENV || "development"}`});
import helmet from 'helmet';
import routes from './routes/routes';
import ShareRouter from './routes/ShareRouter';
import 'reflect-metadata';
import {AppDataSource} from '../Infrastructure/config/db';
import path from 'path';
import {Via} from '../Domain/entities/Via';
import {safeLogger} from '../Infrastructure/config/logger';
import {errorRequestMiddleware, notFoundMiddleware} from './Middlewares/ErrorRequestMiddleware';
import {generalRateLimiter, getRateLimitInfo} from './Middlewares/RateLimitMiddleware';
import {imageCorsMiddleware} from './Middlewares/ImageCorsMiddleware';

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

import cors from 'cors';

const isDev = (process.env.NODE_ENV ?? 'development') === 'development';

if (isDev) {
    app.use((_req, res, next) => {
        res.header('Vary', 'Origin');
        next();
    });

    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
        maxAge: 600,
        preflightContinue: false,
        optionsSuccessStatus: 204
    }));

    app.options(/.*/, cors());
}

/**
 * Segurança básica com Helmet
 * - Controla políticas de conteúdo (CSP)
 * - Permite carregamento de imagens, scripts e estilos externos necessários
 * - Garante configuração mínima de segurança de headers HTTP
 */
app.use(helmet({
    crossOriginResourcePolicy: {policy: 'cross-origin'},
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
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

/**
 * Servindo arquivos estáticos (imagens)
 * - Middleware específico de CORS libera acesso público a assets
 * - Pastas servidas diretamente pelo Express
 */
const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', imageCorsMiddleware, express.static(assetsPath));
safeLogger.info('Servindo arquivos estáticos', {path: assetsPath});

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
// Rotas públicas para preview de compartilhamento (Open Graph / WhatsApp)
app.use('/share', ShareRouter);

// Middleware para rotas inexistentes
app.use(notFoundMiddleware);

// Middleware global de tratamento de erros (sempre o último)
app.use(errorRequestMiddleware);

/**
 * Verifica se o banco de dados existe e cria se necessário
 */
async function ensureDatabaseExists(): Promise<void> {
    const pg = require('pg');
    const {Client} = pg;
    const dbName = process.env.DB_NAME || process.env.POSTGRES_DB;
    
    if (!dbName) {
        throw new Error('DB_NAME ou POSTGRES_DB não está configurado nas variáveis de ambiente');
    }

    // Conectar ao PostgreSQL usando o banco padrão 'postgres'
    const adminClient = new Client({
        host: process.env.DB_HOST || process.env.POSTGRES_HOST,
        port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.DB_USERNAME || process.env.POSTGRES_USER,
        password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
        database: 'postgres' // Conecta ao banco padrão
    });

    try {
        await adminClient.connect();
        
        // Verificar se o banco existe
        const result = await adminClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (result.rows.length === 0) {
            // Banco não existe, criar
            safeLogger.info(`Banco de dados '${dbName}' não encontrado. Criando...`);
            await adminClient.query(`CREATE DATABASE "${dbName}"`);
            safeLogger.info(`Banco de dados '${dbName}' criado com sucesso`);
        } else {
            safeLogger.info(`Banco de dados '${dbName}' já existe`);
        }
    } catch (error: any) {
        safeLogger.error('Erro ao verificar/criar banco de dados', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    } finally {
        await adminClient.end();
    }
}

/**
 * Inicialização da base de dados
 * - Verifica/cria o banco se necessário
 * - Conecta no banco via TypeORM
 * - Executa carga inicial se necessário
 */
async function initializeDatabase() {
    try {
        // Primeiro, garantir que o banco existe
        await ensureDatabaseExists();
        
        // Depois, inicializar o AppDataSource
        await AppDataSource.initialize();
        safeLogger.info('Conexão com o banco de dados estabelecida com sucesso');
        
        const viaRepository = AppDataSource.getRepository(Via);
        const count = await viaRepository.count();

        if (count === 0) {
            safeLogger.info('Banco vazio. Execute "npm run seed" para carregar dados iniciais.');
        } else {
            safeLogger.info('Registros já existentes', { count });
            await fixSequencesOnStartup();
        }
    } catch (error: any) {
        safeLogger.error('Erro ao inicializar banco de dados', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
}

/**
 * Corrige as sequências do banco de dados na inicialização
 * Útil quando dados foram inseridos manualmente ou houve problemas anteriores
 */
async function fixSequencesOnStartup() {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
        safeLogger.info('🔧 Verificando e corrigindo sequências do banco de dados...');
        
        const tables = [
            'continente', 'pais', 'regiao', 'estado', 'cidade', 'bairro', 'localizacao',
            'fonte', 'imagem', 'montanha', 'face', 'setor', 'croqui', 'via', 'usuario',
            'colecao', 'escalada', 'participante', 'via_colecao', 'via_croqui', 'via_imagem'
        ];
        
        for (const table of tables) {
            try {
                const result = await queryRunner.query(`SELECT MAX(id) as max_id FROM "${table}"`);
                const maxId = result[0]?.max_id;
                
                if (maxId) {
                    // Verificar o valor atual da sequência (identificador entre aspas para PostgreSQL)
                    const seqResult = await queryRunner.query(`SELECT last_value FROM ${table}_id_seq`);
                    const currentSeq = seqResult[0]?.last_value;
                    
                    // Só ajustar se a sequência estiver desatualizada
                    if (currentSeq < maxId) {
                        await queryRunner.query(`SELECT setval('${table}_id_seq', ${maxId})`);
                        safeLogger.info(`  ✅ Sequência ${table}_id_seq ajustada de ${currentSeq} para ${maxId}`);
                    }
                }
            } catch (error) {
                // Ignorar erros (tabela pode não existir ou não ter sequência)
            }
        }
        
        safeLogger.info('✅ Verificação de sequências concluída');
    } catch (error: any) {
        safeLogger.error('Erro ao corrigir sequências', {
            error: error.message
        });
    } finally {
        await queryRunner.release();
    }
}

/**
 * Inicialização do servidor HTTP
 * - Aguarda o banco estar pronto antes de subir
 * - Exibe logs com configuração básica e limites aplicados
 */
process.on('unhandledRejection', (reason, promise) => {
    safeLogger.error('Unhandled Rejection', { reason, promise: String(promise) });
});

async function startServer() {
    try {
        await initializeDatabase();
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
    } catch (error: any) {
        safeLogger.error('Falha ao iniciar servidor', {
            error: error?.message,
            stack: error?.stack
        });
        process.exit(1);
    }
}

startServer();
