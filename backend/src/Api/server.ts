import express from 'express';
import routes from './routes/routes';
import 'reflect-metadata';
import { AppDataSource } from '../Infrastructure/config/db';
import { loadData } from '../Infrastructure/initialData/initialLoad';
import { Via } from '../Domain/entities/Via';
import path from 'path';
import { initializeEnvConfig } from '../Infrastructure/config/envinronment';

initializeEnvConfig();

const cors = require('cors');
const app = express();
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;
const HOSTNAME = process.env.API_HOSTNAME || '0.0.0.0';
const FRONTEND_URL = process.env.WEB_HOSTNAME || 'http://localhost:9200'; // URL do frontend

console.log('Frontend URL:', FRONTEND_URL);
console.log('Hostname:', HOSTNAME);
console.log('Port:', PORT);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Necessário para cookies/sessões
  })
);

app.use(express.json());

// Configuração de arquivos estáticos
const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', express.static(assetsPath));
console.log('Servindo arquivos estáticos de:', assetsPath);

// Configuração das rotas
app.use('/api', routes);

// Inicializar a conexão com o banco de dados
AppDataSource.initialize()
  .then(async () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    const viaRepository = AppDataSource.getRepository(Via);
    const count = await viaRepository.count();
    if (count === 0) {
      console.log('Nenhum registro encontrado na tabela Via, iniciando carga de dados...');
      await loadData();
      console.log('Carga inicial realizada com sucesso');
    } else {
      console.log('Registros já existentes na tabela Via, pulando a carga de dados.');
    }
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    console.error(error.stack);
    process.exit(1);
  });

// Inicializar o servidor
app.listen(PORT, HOSTNAME, () => {
  console.log('Configurações do servidor:');
  console.log('FRONTEND_URL:', FRONTEND_URL);
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_NAME:', process.env.DB_NAME);
});
