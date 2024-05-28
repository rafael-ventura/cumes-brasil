"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = __importDefault(require("./routes/routes"));
require("reflect-metadata");
const swagger_output_json_1 = __importDefault(require("../swagger_output.json"));
const db_1 = require("../Infrastructure/config/db");
const initialLoad_1 = require("../Infrastructure/sql_scripts/initialLoad");
const Via_1 = require("../Domain/entities/Via");
const path_1 = __importDefault(require("path"));
dotenv.config();
const cors = require('cors');
const app = (0, express_1.default)();
const isDevelopment = process.env.NODE_ENV === 'development';
const corsOptions = {
    origin: isDevelopment
        ? 'http://localhost:9000'
        : 'http://192.168.1.147:9000'
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 4020;
// Servir arquivos estáticos da pasta assets
const assetsPath = path_1.default.join(__dirname, '../../assets');
console.log('Servidor está servindo arquivos estáticos no diretório:', assetsPath);
app.use('/assets', express_1.default.static(assetsPath));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
db_1.AppDataSource.initialize().then(async () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    const viaRepository = db_1.AppDataSource.getRepository(Via_1.Via);
    const count = await viaRepository.count();
    if (count === 0) {
        console.log('Nenhum registro encontrado na tabela Via, iniciando carga de dados...');
        (0, initialLoad_1.loadData)().then(() => console.log('Carga inicial realizada com sucesso'))
            .catch(e => console.log('Erro na carga de dados:', e));
    }
    else {
        console.log('Registros já existentes na tabela Via, pulando a carga de dados.');
    }
}).catch(error => console.log('Erro ao conectar com o banco de dados:', error));
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
    console.log(process.cwd());
});
