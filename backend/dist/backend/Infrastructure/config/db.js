"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
function connect() {
    // 'path.join' junta o diretório atual com o caminho relativo do banco de dados
    const dbPath = path_1.default.join(__dirname, '../../../database/sqlite/cumes_brasil.db');
    console.log(dbPath);
    return new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        }
        else {
            console.log('Conectado ao banco de dados SQLite.');
        }
    });
}
const dbConnection = connect();
exports.default = dbConnection;
