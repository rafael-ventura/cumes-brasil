"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
require("reflect-metadata");
const db_1 = require("../Infrastructure/config/db");
const initialLoad_1 = require("../Infrastructure/initialData/initialLoad");
const Via_1 = require("../Domain/entities/Via");
const path_1 = __importDefault(require("path"));
const envinronment_1 = require("../Infrastructure/config/envinronment");
(0, envinronment_1.initializeEnvConfig)();
const cors = require("cors");
const app = (0, express_1.default)();
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;
const HOSTNAME = process.env.API_HOSTNAME || '0.0.0.0';
app.use(cors());
app.use(express_1.default.json());
const assetsPath = path_1.default.resolve(__dirname, '../../assets');
app.use('/assets', express_1.default.static(assetsPath));
console.log('Serving static files from', assetsPath);
app.use('/api', routes_1.default);
db_1.AppDataSource.initialize()
    .then(async () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    const viaRepository = db_1.AppDataSource.getRepository(Via_1.Via);
    const count = await viaRepository.count();
    if (count === 0) {
        console.log('Nenhum registro encontrado na tabela Via, iniciando carga de dados...');
        await (0, initialLoad_1.loadData)();
        console.log('Carga inicial realizada com sucesso');
    }
    else {
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
        console.log("SECRET_KEY:", process.env.SECRET_KEY);
        console.log("API_HOSTNAME:", process.env.API_HOSTNAME);
        console.log("API_PORT:", process.env.API_PORT);
        console.log("WEB_HOSTNAME:", process.env.WEB_HOSTNAME);
        console.log("WEB_PORT:", process.env.WEB_PORT);
        console.log("WEB_USER_RESET_PASSWORD_PATH:", process.env.WEB_USER_RESET_PASSWORD_PATH);
        console.log("MAIL_USER:", process.env.MAIL_USER);
        console.log("OAUTH2_ENABLED:", process.env.OAUTH2_ENABLED);
        console.log("ASSETS_PATH:", assetsPath);
        console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
        console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
    });
}
