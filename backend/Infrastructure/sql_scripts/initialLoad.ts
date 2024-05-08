import { AppDataSource } from "../config/db";
import { Fonte } from "../../Domain/entities/Fonte";
import { Montanha } from "../../Domain/entities/Montanha";
import { Face } from "../../Domain/entities/Face";
import { Via } from "../../Domain/entities/Via";
import { Croqui } from "../../Domain/entities/Croqui";
import * as initialData from "../../../database/json/initialData.json";

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

    // Processo de criação e salvamento das entidades
    const fontes = fonteRepository.create(initialData.fontes);
    await fonteRepository.save(fontes);

    const montanhas = montanhaRepository.create(initialData.montanhas);
    await montanhaRepository.save(montanhas);

    const faces = faceRepository.create(initialData.faces);
    await faceRepository.save(faces);

    const vias = viaRepository.create(initialData.vias);
    await viaRepository.save(vias);

    const croquis = croquiRepository.create(initialData.croquis);
    await croquiRepository.save(croquis);

    await queryRunner.commitTransaction();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}
