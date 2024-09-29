import { AppDataSource } from '../../backend/src/Infrastructure/config/db';
import { Fonte } from '../../backend/src/Domain/entities/Fonte';
import { Montanha } from '../../backend/src/Domain/entities/Montanha';
import { Face } from '../../backend/src/Domain/entities/Face';
import { Via } from '../../backend/src/Domain/entities/Via';
import { Croqui } from '../../backend/src/Domain/entities/Croqui';
import { Imagem } from '../../backend/src/Domain/entities/Imagem';
import { Usuario } from '../../backend/src/Domain/entities/Usuario';
import fs from 'fs';

const viasJson = JSON.parse(fs.readFileSync('vias.json', 'utf8'));
const croquisJson = JSON.parse(fs.readFileSync('croquis.json', 'utf8'));
const facesJson = JSON.parse(fs.readFileSync('faces.json', 'utf8'));
const montanhasJson = JSON.parse(fs.readFileSync('montanhas.json', 'utf8'));
const fontesJson = JSON.parse(fs.readFileSync('fontes.json', 'utf8'));
const imagensJson = JSON.parse(fs.readFileSync('imagens.json', 'utf8'));
const usuariosJson = JSON.parse(fs.readFileSync('usuarios.json', 'utf8'));
const viasCroquisJson = JSON.parse(fs.readFileSync('vias_croquis.json', 'utf8'));
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
