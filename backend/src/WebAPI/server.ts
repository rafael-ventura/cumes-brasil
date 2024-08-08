import * as dotenv from 'dotenv';
import express from 'express';
import routes from './routes/routes';
import 'reflect-metadata';
import { AppDataSource } from '../Infrastructure/config/db';
import { loadData } from '../Infrastructure/sql_scripts/initialLoad';
import { Via } from '../Domain/entities/Via';
import path from 'path';

dotenv.config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4020;

const allowedOrigins = [
    "http://localhost:4020",
    "http://localhost:9000",
    'http://localhost:9200',
    "http://localhost:8080",
    "http://192.168.1.147:4020",
    "http://192.168.1.147:9000"
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

app.use(cors(corsOptions));
app.use(express.json());

// Servir arquivos estáticos da pasta assets
const assetsPath = path.join(__dirname, "../../assets");
console.log("Servidor está servindo arquivos estáticos no diretório:", assetsPath);
app.use("/assets", express.static(assetsPath));
app.use('/api', routes);

AppDataSource.initialize().then(async () => {
    console.log("Conexão com o banco de dados estabelecida com sucesso");

    const viaRepository = AppDataSource.getRepository(Via);
    const count = await viaRepository.count();
    if (count === 0) {
        console.log("Nenhum registro encontrado na tabela Via, iniciando carga de dados...");
        loadData().then(() => console.log("Carga inicial realizada com sucesso"))
          .catch(e => console.log("Erro na carga de dados:", e));
    } else {
        console.log("Registros já existentes na tabela Via, pulando a carga de dados.");
    }
}).catch(error => console.log("Erro ao conectar com o banco de dados:", error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("The server is running in", process.env.NODE_ENV, "mode");
    console.log("The CORS origin is", corsOptions.origin);
    console.log(process.cwd());
});
