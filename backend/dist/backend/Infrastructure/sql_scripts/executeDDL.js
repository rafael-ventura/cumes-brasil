"use strict";
// executeDDL.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const sqlFilePath = path.join(__dirname, '../../../database/sqlite/scripts/create_database.sql');
const dbFilePath = path.join(__dirname, '../../../database/sqlite/cumes_brasil.db');
const bancoDados = new sqlite3_1.Database(dbFilePath, (error) => {
    if (error) {
        console.error(error.message);
        throw error;
    }
    console.log('Conectado ao banco de dados SQLite.');
});
const ddl = (0, fs_1.readFileSync)(sqlFilePath, 'utf8');
bancoDados.exec(ddl, (error) => {
    if (error) {
        console.error(error.message);
        throw error;
    }
    console.log('DDL executado com sucesso.');
});
bancoDados.close((error) => {
    if (error) {
        console.error(error.message);
        throw error;
    }
    console.log('Conexão com o banco de dados fechada.');
});
