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
const FRONTEND_URL = process.env.WEB_HOSTNAME || 'http://localhost:9200';

console.log('Frontend URL:', FRONTEND_URL);
console.log('Hostname:', HOSTNAME);
console.log('Port:', PORT);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());

const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', express.static(assetsPath));
console.log('Servindo arquivos estáticos de:', assetsPath);

app.use('/api', routes);

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


app.listen(PORT, HOSTNAME, () => {
  console.log('Configurações do servidor:');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
  console.log('AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME);
  console.log('CLOUDFRONT_URL:', process.env.CLOUDFRONT_URL);
});
