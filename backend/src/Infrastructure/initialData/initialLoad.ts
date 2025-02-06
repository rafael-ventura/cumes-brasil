import {AppDataSource} from '../config/db';
import {Fonte} from '../../Domain/entities/Fonte';
import {Via} from '../../Domain/entities/Via';
import {Croqui} from '../../Domain/entities/Croqui';
import {Imagem} from '../../Domain/entities/Imagem';
import {ObjectType, QueryRunner} from "typeorm";
import fs from "fs";
import {Usuario} from "../../Domain/entities/Usuario";
import {Face} from "../../Domain/entities/Face";
import {Montanha} from "../../Domain/entities/Montanha";
import {ViaCroqui} from "../../Domain/entities/ViaCroqui";

const fontesJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/fontes.json', 'utf8'));
const imagensJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/imagens.json', 'utf8'));
const viasJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/vias.json', 'utf8'));
const croquisJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/croquis.json', 'utf8'));
const facesJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/faces.json', 'utf8'));
const montanhasJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/montanhas.json', 'utf8'));
const usuariosJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/usuarios.json', 'utf8'));
const viasCroquisJson = JSON.parse(fs.readFileSync('src/Infrastructure/initialData/via_croquis.json', 'utf8'));

export async function loadData() {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await insertData(queryRunner, Fonte, fontesJson);
    await insertData(queryRunner, Imagem, imagensJson);
    await insertData(queryRunner, Montanha, montanhasJson);
    await insertData(queryRunner, Face, facesJson);
    await insertData(queryRunner, Croqui, croquisJson);
    await insertData(queryRunner, Via, viasJson);
    await insertData(queryRunner, Usuario, usuariosJson);
    await associateViaCroqui(queryRunner);

    console.log("✅ Todos os dados foram carregados com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error);
  } finally {
    await queryRunner.release();
  }
}

async function insertData<T>(
    queryRunner: QueryRunner,
    entityClass: ObjectType<T>,
    data: T[]
) {
  await queryRunner.startTransaction();
  try {
    const repository = queryRunner.manager.getRepository(entityClass);
    const entities = repository.create(data);
    await repository.insert(entities);
    await queryRunner.commitTransaction();
    console.log(`✅ ${entityClass.name} inserido com sucesso.`);
  } catch (error) {
    console.error(`❌ Erro ao inserir ${entityClass.name}:`, error);
    await queryRunner.rollbackTransaction();
  }
}

async function associateViaCroqui(queryRunner: QueryRunner) {
  await queryRunner.startTransaction();
  try {
    const viaCroquiRepository = queryRunner.manager.getRepository(ViaCroqui);

    const viaCroquis = viasCroquisJson.map((viaCroquiData: any) => {
      return viaCroquiRepository.create({
        id: viaCroquiData.id, // Se o ID já estiver no JSON, mantemos
        via: {id: viaCroquiData.via_id}, // Apenas referenciando o ID
        croqui: {id: viaCroquiData.croqui_id}, // Apenas referenciando o ID
      });
    });

    await viaCroquiRepository.insert(viaCroquis);

    await queryRunner.commitTransaction();
    console.log("✅ Via-Croqui inserida diretamente.");
  } catch (error) {
    console.error("❌ Erro ao inserir Via-Croqui:", error);
    await queryRunner.rollbackTransaction();
  }
}
