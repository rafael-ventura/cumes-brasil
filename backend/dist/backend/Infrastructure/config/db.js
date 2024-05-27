"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const path_1 = __importDefault(require("path"));
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
const ColecaoVia_1 = require("../../Domain/entities/ColecaoVia");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: path_1.default.join(__dirname, "../../../database/sqlite/cumes_brasil.db"),
    synchronize: true,
    logging: false,
    entities: [
        Colecao_1.Colecao,
        ColecaoVia_1.ColecaoVia,
        Croqui_1.Croqui,
        Escalada_1.Escalada,
        Face_1.Face,
        Fonte_1.Fonte,
        Imagem_1.Imagem,
        Montanha_1.Montanha,
        Usuario_1.Usuario,
        Via_1.Via
    ]
});
