"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = void 0;
const db_1 = require("../config/db");
const Fonte_1 = require("../../Domain/entities/Fonte");
const Montanha_1 = require("../../Domain/entities/Montanha");
const Face_1 = require("../../Domain/entities/Face");
const Via_1 = require("../../Domain/entities/Via");
const Croqui_1 = require("../../Domain/entities/Croqui");
const Imagem_1 = require("../../Domain/entities/Imagem");
const Usuario_1 = require("../../Domain/entities/Usuario");
const vias_json_1 = __importDefault(require("../../../database/json/vias.json"));
const croquis_json_1 = __importDefault(require("../../../database/json/croquis.json"));
const faces_json_1 = __importDefault(require("../../../database/json/faces.json"));
const montanhas_json_1 = __importDefault(require("../../../database/json/montanhas.json"));
const fontes_json_1 = __importDefault(require("../../../database/json/fontes.json"));
const imagens_json_1 = __importDefault(require("../../../database/json/imagens.json"));
const usuarios_json_1 = __importDefault(require("../../../database/json/usuarios.json"));
const via_croquis_json_1 = __importDefault(require("../../../database/json/via_croquis.json"));
async function loadData() {
    const queryRunner = db_1.AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const fonteRepository = queryRunner.manager.getRepository(Fonte_1.Fonte);
        const montanhaRepository = queryRunner.manager.getRepository(Montanha_1.Montanha);
        const faceRepository = queryRunner.manager.getRepository(Face_1.Face);
        const viaRepository = queryRunner.manager.getRepository(Via_1.Via);
        const croquiRepository = queryRunner.manager.getRepository(Croqui_1.Croqui);
        const imagemRepository = queryRunner.manager.getRepository(Imagem_1.Imagem);
        const usuarioRepository = queryRunner.manager.getRepository(Usuario_1.Usuario);
        const fontes = fonteRepository.create(fontes_json_1.default.fontes);
        await fonteRepository.save(fontes);
        const imagens = imagemRepository.create(imagens_json_1.default.imagens);
        await imagemRepository.save(imagens);
        const montanhas = montanhaRepository.create(montanhas_json_1.default.montanhas);
        await montanhaRepository.save(montanhas);
        const faces = faceRepository.create(faces_json_1.default.faces);
        await faceRepository.save(faces);
        const vias = viaRepository.create(vias_json_1.default.vias);
        await viaRepository.save(vias);
        const croquis = croquiRepository.create(croquis_json_1.default.croquis);
        await croquiRepository.save(croquis);
        const usuarios = usuarioRepository.create(usuarios_json_1.default.usuarios);
        await usuarioRepository.save(usuarios);
        for (const viaCroqui of via_croquis_json_1.default.via_croquis) {
            const via = await viaRepository.findOne({ where: { id: viaCroqui.via_id } });
            const croqui = await croquiRepository.findOne({ where: { id: viaCroqui.croqui_id } });
            if (via && croqui) {
                via.croquis = [...(via.croquis || []), croqui];
                await viaRepository.save(via);
            }
        }
        await queryRunner.commitTransaction();
    }
    catch (error) {
        console.error("Erro ao carregar dados:", error);
        await queryRunner.rollbackTransaction();
    }
    finally {
        await queryRunner.release();
    }
}
exports.loadData = loadData;
