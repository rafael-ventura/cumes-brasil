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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Via_1 = require("../../Domain/entities/Via");
const Usuario_1 = require("../../Domain/entities/Usuario");
const Croqui_1 = require("../../Domain/entities/Croqui");
const Face_1 = require("../../Domain/entities/Face");
const Montanha_1 = require("../../Domain/entities/Montanha");
const Fonte_1 = require("../../Domain/entities/Fonte");
const Colecao_1 = require("../../Domain/entities/Colecao");
const Escalada_1 = require("../../Domain/entities/Escalada");
const Imagem_1 = require("../../Domain/entities/Imagem");
const Participante_1 = require("../../Domain/entities/Participante");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        Colecao_1.Colecao,
        Croqui_1.Croqui,
        Escalada_1.Escalada,
        Face_1.Face,
        Fonte_1.Fonte,
        Imagem_1.Imagem,
        Montanha_1.Montanha,
        Usuario_1.Usuario,
        Via_1.Via,
        Participante_1.Participante
    ]
});
