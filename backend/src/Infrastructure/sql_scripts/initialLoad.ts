import { AppDataSource } from '../config/db';
import { Fonte } from '../../Domain/entities/Fonte';
import { Montanha } from '../../Domain/entities/Montanha';
import { Face } from '../../Domain/entities/Face';
import { Via } from '../../Domain/entities/Via';
import { Croqui } from '../../Domain/entities/Croqui';
import { Imagem } from '../../Domain/entities/Imagem';
import { Usuario } from '../../Domain/entities/Usuario';
import fs from 'fs';
import path from 'path';

// Função auxiliar para carregar um arquivo JSON a partir do diretório correto
function loadJson(filename: string) {
  const filePath = path.join(__dirname, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Carregar os dados dos arquivos JSON
const viasJson = loadJson('vias.json');
const croquisJson = loadJson('croquis.json');
const facesJson = loadJson('faces.json');
const montanhasJson = loadJson('montanhas.json');
const fontesJson = loadJson('fontes.json');
const imagensJson = loadJson('imagens.json');
const usuariosJson = loadJson('usuarios.json');
const viasCroquisJson = loadJson('vias_croquis.json');

export async function loadData() {
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const fonteRepository = queryRunner.manager.getRepository(Fonte);
    const montanhaRepository = queryRunner.manager.getRepository(Montanha);
    const faceRepository = queryRunner.manager.getRepository(Face);
    const viaRepository = queryRunner.manager.getRepository(Via);
    const croquiRepository = queryRunner.manager.getRepository(Croqui);
    const imagemRepository = queryRunner.manager.getRepository(Imagem);
    const usuarioRepository = queryRunner.manager.getRepository(Usuario);

    const fontes = fonteRepository.create(fontesJson.fontes);
    await fonteRepository.save(fontes);

    const imagens = imagemRepository.create(imagensJson.imagens);
    await imagemRepository.save(imagens);

    const montanhas = montanhaRepository.create(montanhasJson.montanhas);
    await montanhaRepository.save(montanhas);

    const faces = faceRepository.create(facesJson.faces);
    await faceRepository.save(faces);

    const vias = viaRepository.create(viasJson.vias);
    await viaRepository.save(vias);

    const croquis = croquiRepository.create(croquisJson.croquis);
    await croquiRepository.save(croquis);

    const usuarios = usuarioRepository.create(usuariosJson.usuarios);
    await usuarioRepository.save(usuarios);

    for (const viaCroqui of viasCroquisJson.via_croquis) {
      const via = await viaRepository.findOne({ where: { id: viaCroqui.via_id } });
      const croqui = await croquiRepository.findOne({ where: { id: viaCroqui.croqui_id } });
      if (via && croqui) {
        via.croquis = [...(via.croquis || []), croqui];
        await viaRepository.save(via);
      }
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}
