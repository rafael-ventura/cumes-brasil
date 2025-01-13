"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const envinronment_1 = require("./envinronment");
const Colecao_1 = require("../../Domain/entities/Colecao");
const Croqui_1 = require("../../Domain/entities/Croqui");
const Escalada_1 = require("../../Domain/entities/Escalada");
const Face_1 = require("../../Domain/entities/Face");
const Fonte_1 = require("../../Domain/entities/Fonte");
const Imagem_1 = require("../../Domain/entities/Imagem");
const Montanha_1 = require("../../Domain/entities/Montanha");
const Usuario_1 = require("../../Domain/entities/Usuario");
const Via_1 = require("../../Domain/entities/Via");
const Participante_1 = require("../../Domain/entities/Participante");
const ViaColecao_1 = require("../../Domain/entities/ViaColecao");
(0, envinronment_1.initializeEnvConfig)();
exports.AppDataSource = new typeorm_1.DataSource({
    schema: 'public',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, //MANTER FALSE
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
        Participante_1.Participante,
        ViaColecao_1.ViaColecao
    ],
    migrations: ['dist/Infrastructure/migrations/*.js'],
    ssl: false
});
