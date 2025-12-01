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
import {Continente} from "../../Domain/entities/Continente";
import {Pais} from "../../Domain/entities/Pais";
import {Regiao} from "../../Domain/entities/Regiao";
import {Estado} from "../../Domain/entities/Estado";
import {Cidade} from "../../Domain/entities/Cidade";
import {Bairro} from "../../Domain/entities/Bairro";
import {Localizacao} from "../../Domain/entities/Localizacao";
import {Setor} from "../../Domain/entities/Setor";
import path from "path";

const basePath = path.resolve(__dirname, "../../Infrastructure/initialData");
const continentesJson = JSON.parse(fs.readFileSync(`${basePath}/continentes.json`, "utf8"));
const paisesJson = JSON.parse(fs.readFileSync(`${basePath}/paises.json`, "utf8"));
const regioesJson = JSON.parse(fs.readFileSync(`${basePath}/regioes.json`, "utf8"));
const estadosJson = JSON.parse(fs.readFileSync(`${basePath}/estados.json`, "utf8"));
const cidadesJson = JSON.parse(fs.readFileSync(`${basePath}/cidades.json`, "utf8"));
const bairrosJson = JSON.parse(fs.readFileSync(`${basePath}/bairros.json`, "utf8"));
const localizacoesJson = JSON.parse(fs.readFileSync(`${basePath}/localizacoes.json`, "utf8"));
const fontesJson = JSON.parse(fs.readFileSync(`${basePath}/fontes.json`, "utf8"));
const imagensJson = JSON.parse(fs.readFileSync(`${basePath}/imagens.json`, "utf8"));
const viasJson = JSON.parse(fs.readFileSync(`${basePath}/vias.json`, "utf8"));
const croquisJson = JSON.parse(fs.readFileSync(`${basePath}/croquis.json`, "utf8"));
const facesJson = JSON.parse(fs.readFileSync(`${basePath}/faces.json`, "utf8"));
const montanhasJson = JSON.parse(fs.readFileSync(`${basePath}/montanhas.json`, "utf8"));
const setoresJson = JSON.parse(fs.readFileSync(`${basePath}/setores.json`, "utf8"));
const usuariosJson = JSON.parse(fs.readFileSync(`${basePath}/usuarios.json`, "utf8"));
const viasCroquisJson = JSON.parse(fs.readFileSync(`${basePath}/via_croquis.json`, "utf8"));

export async function loadData() {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  // Iniciar uma única transação para todo o processo
  await queryRunner.startTransaction();

  try {
    // Carregar hierarquia geográfica (ordem é importante)
    await insertData(queryRunner, Continente, continentesJson);
    await insertData(queryRunner, Pais, paisesJson);
    await insertData(queryRunner, Regiao, regioesJson);
    await insertData(queryRunner, Estado, estadosJson);
    await insertData(queryRunner, Cidade, cidadesJson);
    await insertData(queryRunner, Bairro, bairrosJson);
    await insertData(queryRunner, Localizacao, localizacoesJson);
    
    // Carregar dados existentes
    await insertData(queryRunner, Fonte, fontesJson);
    await insertData(queryRunner, Imagem, imagensJson);
    await insertData(queryRunner, Montanha, montanhasJson);
    await insertData(queryRunner, Face, facesJson);
    await insertData(queryRunner, Setor, setoresJson);
    await insertData(queryRunner, Croqui, croquisJson);
    await insertData(queryRunner, Via, viasJson);
    
    await insertData(queryRunner, Usuario, usuariosJson);
    await associateViaCroqui(queryRunner);
    await associateLocalizacoes(queryRunner);

    // Se chegou até aqui, tudo deu certo - commit de tudo
    await queryRunner.commitTransaction();
    console.log("✅ Todos os dados foram carregados com sucesso!");
  } catch (error) {
    // Se der erro em qualquer ponto, faz rollback de tudo
    console.error("❌ Erro ao carregar dados. Fazendo rollback de todas as alterações...", error);
    await queryRunner.rollbackTransaction();
    throw error; // Re-lança o erro para que o chamador saiba que falhou
  } finally {
    await queryRunner.release();
  }
}

async function insertData<T>(
    queryRunner: QueryRunner,
    entityClass: ObjectType<T>,
    data: T[]
) {
  if (data.length === 0) {
    console.log(`⚠️ ${entityClass.name} está vazio, pulando inserção.`);
    return;
  }

  // Obter metadados da entidade para descobrir o nome da tabela
  const metadata = queryRunner.manager.connection.getMetadata(entityClass);
  const tableName = metadata.tableName;
  
  // Mapear campos do JSON para nomes de coluna do banco
  // TypeORM usa {propriedade}Id para foreign keys
  const fieldMapping: { [key: string]: string } = {};
  
  // Mapear relacionamentos ManyToOne
  for (const relation of metadata.relations) {
    if (relation.relationType === 'many-to-one') {
      const joinColumn = relation.joinColumns?.[0];
      if (joinColumn) {
        // Mapear o nome da propriedade (ex: "continente") para o nome da coluna (ex: "continenteId")
        fieldMapping[relation.propertyName] = joinColumn.databaseName;
      }
    }
  }
  
  // Usar SQL direto para inserir - isso evita problemas de validação de FK dentro da transação
  for (const item of data) {
    const itemData: any = { ...item };
    const columns: string[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];
    let paramIndex = 1;
    
    // Processar cada coluna da entidade
    for (const column of metadata.columns) {
      const columnName = column.databaseName;
      let value: any = undefined;
      
      // Verificar se é uma foreign key
      const relation = metadata.relations.find(rel => {
        const joinCol = rel.joinColumns?.[0];
        return joinCol && joinCol.databaseName === columnName;
      });
      
      if (relation) {
        // É uma foreign key - pegar o valor do campo relacionado no JSON
        const jsonFieldName = relation.propertyName;
        value = itemData[jsonFieldName];
        if (value !== undefined && value !== null) {
          // Se for número, usar diretamente
          if (typeof value === 'number') {
            value = value;
          } 
          // Se for objeto, extrair o id
          else if (typeof value === 'object') {
            if (value.id !== undefined) {
              value = value.id;
            } else {
              // Se não tiver id no objeto, tentar usar null (pode ser nullable)
              value = null;
            }
          }
        } else {
          value = null;
        }
      } else {
        // Coluna normal - pegar pelo nome da propriedade
        const propName = column.propertyName;
        value = itemData[propName];
        
        // Se for objeto e não for uma foreign key, não incluir (pode ser um relacionamento OneToMany)
        if (value !== undefined && typeof value === 'object' && !Array.isArray(value) && value.id === undefined) {
          value = undefined; // Não incluir objetos complexos que não são foreign keys
        }
      }
      
      // Adicionar à query se o valor não for undefined
      if (value !== undefined) {
        columns.push(`"${columnName}"`);
        values.push(value);
        placeholders.push(`$${paramIndex}`);
        paramIndex++;
      }
    }
    
    if (columns.length > 0) {
      const sql = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING "id"`;
      await queryRunner.query(sql, values);
    }
  }
  
  console.log(`✅ ${entityClass.name} inserido com sucesso.`);
}


async function associateViaCroqui(queryRunner: QueryRunner) {
  // Não inicia nova transação - usa a transação global
  const viaCroquiRepository = queryRunner.manager.getRepository(ViaCroqui);

  const viaCroquis = viasCroquisJson.map((viaCroquiData: any) => {
    return viaCroquiRepository.create({
      id: viaCroquiData.id, // Se o ID já estiver no JSON, mantemos
      via: {id: viaCroquiData.via_id}, // Apenas referenciando o ID
      croqui: {id: viaCroquiData.croqui_id}, // Apenas referenciando o ID
    });
  });

  await viaCroquiRepository.insert(viaCroquis);
  console.log("✅ Via-Croqui associado com sucesso.");
}

async function associateLocalizacoes(queryRunner: QueryRunner) {
  // Não inicia nova transação - usa a transação global
  // Descobrir os nomes corretos das colunas consultando a estrutura das tabelas
  
  // Função auxiliar para descobrir nomes de colunas
  const getColumnNames = async (tableName: string): Promise<{ entityCol: string; relatedCol: string }> => {
    try {
      const result = await queryRunner.manager.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
        [tableName]
      );
      
      if (result.length >= 2) {
        // TypeORM geralmente usa: {entity}Id e {relatedEntity}Id
        return {
          entityCol: result[0].column_name,
          relatedCol: result[1].column_name
        };
      }
      // Fallback para nomes padrão
      return {
        entityCol: tableName.split('_')[0] + 'Id',
        relatedCol: 'localizacaoId'
      };
    } catch {
      // Se não conseguir descobrir, usar padrão
      return {
        entityCol: tableName.split('_')[0] + 'Id',
        relatedCol: 'localizacaoId'
      };
    }
  };

  // Associar localizações às montanhas
  console.log("Associando localizações às montanhas...");
  const montanhaCols = await getColumnNames('montanha_localizacoes');
  for (const montanhaData of montanhasJson) {
    if (montanhaData.localizacoes && montanhaData.localizacoes.length > 0) {
      try {
        const montanhaId = montanhaData.id;
        const localizacaoIds = montanhaData.localizacoes;
        
        for (const locId of localizacaoIds) {
          const locExists = await queryRunner.manager.query(
            'SELECT 1 FROM localizacao WHERE id = $1',
            [locId]
          );
          
          if (locExists.length === 0) {
            console.warn(`⚠️ Localização ${locId} não encontrada para montanha ${montanhaId}`);
            continue;
          }
          
          await queryRunner.manager.query(
            `INSERT INTO montanha_localizacoes ("${montanhaCols.entityCol}", "${montanhaCols.relatedCol}") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [montanhaId, locId]
          );
        }
      } catch (error) {
        console.error(`❌ Erro ao associar localizações à montanha ${montanhaData.id}:`, error);
        throw error;
      }
    }
  }

  // Associar localizações às faces
  console.log("Associando localizações às faces...");
  const faceCols = await getColumnNames('face_localizacoes');
  for (const faceData of facesJson) {
    if (faceData.localizacoes && faceData.localizacoes.length > 0) {
      try {
        const faceId = faceData.id;
        const localizacaoIds = faceData.localizacoes;
        
        for (const locId of localizacaoIds) {
          const locExists = await queryRunner.manager.query(
            'SELECT 1 FROM localizacao WHERE id = $1',
            [locId]
          );
          
          if (locExists.length === 0) {
            console.warn(`⚠️ Localização ${locId} não encontrada para face ${faceId}`);
            continue;
          }
          
          await queryRunner.manager.query(
            `INSERT INTO face_localizacoes ("${faceCols.entityCol}", "${faceCols.relatedCol}") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [faceId, locId]
          );
        }
      } catch (error) {
        console.error(`❌ Erro ao associar localizações à face ${faceData.id}:`, error);
        throw error;
      }
    }
  }

  // Associar localizações aos setores (se houver dados)
  console.log("Associando localizações aos setores...");
  const setorCols = await getColumnNames('setor_localizacoes');
  const setoresJson = JSON.parse(fs.readFileSync(`${basePath}/setores.json`, "utf8"));
  for (const setorData of setoresJson) {
    if (setorData.localizacoes && setorData.localizacoes.length > 0) {
      try {
        const setorId = setorData.id;
        const localizacaoIds = setorData.localizacoes;
        
        for (const locId of localizacaoIds) {
          const locExists = await queryRunner.manager.query(
            'SELECT 1 FROM localizacao WHERE id = $1',
            [locId]
          );
          
          if (locExists.length === 0) {
            console.warn(`⚠️ Localização ${locId} não encontrada para setor ${setorId}`);
            continue;
          }
          
          await queryRunner.manager.query(
            `INSERT INTO setor_localizacoes ("${setorCols.entityCol}", "${setorCols.relatedCol}") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [setorId, locId]
          );
        }
      } catch (error) {
        console.error(`❌ Erro ao associar localizações ao setor ${setorData.id}:`, error);
        throw error;
      }
    }
  }

  console.log("✅ Localizações associadas com sucesso.");
}
