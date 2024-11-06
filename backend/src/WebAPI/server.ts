import express from 'express';
import routes from './routes/routes';
import 'reflect-metadata';
import { AppDataSource } from '../Infrastructure/config/db';
import { loadData } from '../Infrastructure/sql_scripts/initialLoad';
import { Via } from '../Domain/entities/Via';
import path from 'path';
import { initializeEnvConfig } from '../Infrastructure/config/envinronment';

initializeEnvConfig();

const cors = require("cors");
const app = express();
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;
const HOSTNAME = process.env.API_HOSTNAME || '0.0.0.0';
app.use(cors());
app.use(express.json());
const assetsPath = path.resolve(__dirname, '../../assets');
app.use('/assets', express.static(assetsPath));
console.log('Serving static files from', assetsPath);
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
  .catch(error => {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    console.error(error.stack);
    process.exit(1);
  });

if (typeof PORT === 'number') {
  app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USERNAME:", process.env.DB_USERNAME);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("DB_PORT:", process.env.DB_PORT);
    console.log("ASSETS_PATH:", assetsPath);
});
}
