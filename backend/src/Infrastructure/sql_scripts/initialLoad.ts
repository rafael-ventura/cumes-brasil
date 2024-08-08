import { AppDataSource } from '../config/db';
import { Fonte } from '../../Domain/entities/Fonte';
import { Montanha } from '../../Domain/entities/Montanha';
import { Face } from '../../Domain/entities/Face';
import { Via } from '../../Domain/entities/Via';
import { Croqui } from '../../Domain/entities/Croqui';
import { Imagem } from '../../Domain/entities/Imagem';
import { Usuario } from '../../Domain/entities/Usuario';

import viasJson from '../../../database/json/vias.json';
import croquisJson from '../../../database/json/croquis.json';
import facesJson from '../../../database/json/faces.json';
import montanhasJson from '../../../database/json/montanhas.json';
import fontesJson from '../../../database/json/fontes.json';
import imagensJson from '../../../database/json/imagens.json';
import usuariosJson from '../../../database/json/usuarios.json';
import viasCroquisJson from '../../../database/json/via_croquis.json';

export async function loadData () {
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
