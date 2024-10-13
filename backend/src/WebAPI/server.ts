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
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:9000',
  'http://localhost:9200',
  'http://54.236.242.52',
  'http://54.236.242.52:8080'
];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        // Permitir requests sem origin, como apps móveis ou curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors()); // Permite todas as origens

app.use(express.json());

// Servir arquivos estáticos da pasta assets
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
      console.error(error.stack); // Adiciona a stack trace do erro
      process.exit(1); // Encerra o processo se a conexão falhar
  });

if (typeof PORT === 'number') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USERNAME:", process.env.DB_USERNAME);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("DB_PORT:", process.env.DB_PORT);
});
}
