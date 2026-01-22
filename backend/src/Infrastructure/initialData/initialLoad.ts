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

// Cache global de IDs: { tabela: { indiceNoJSON: idReal } }
const idCache: { [tableName: string]: { [jsonIndex: number]: number } } = {};

export async function loadData() {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  // Iniciar uma única transação para todo o processo
  await queryRunner.startTransaction();

  try {
    console.log("🚀 Iniciando carga de dados...\n");
    
    // Carregar hierarquia geográfica (ordem é importante)
    await insertDataSimple(queryRunner, Continente, continentesJson);
    await insertDataWithFKResolution(queryRunner, Pais, paisesJson);
    await insertDataWithFKResolution(queryRunner, Regiao, regioesJson);
    await insertDataWithFKResolution(queryRunner, Estado, estadosJson);
    await insertDataWithFKResolution(queryRunner, Cidade, cidadesJson);
    await insertDataWithFKResolution(queryRunner, Bairro, bairrosJson);
    await insertDataWithFKResolution(queryRunner, Localizacao, localizacoesJson);
    
    // Carregar dados existentes
    await insertDataSimple(queryRunner, Fonte, fontesJson);
    await insertDataWithFKResolution(queryRunner, Imagem, imagensJson);
    await insertDataWithFKResolution(queryRunner, Montanha, montanhasJson);
    await insertDataWithFKResolution(queryRunner, Face, facesJson);
    await insertDataWithFKResolution(queryRunner, Setor, setoresJson);
    await insertDataWithFKResolution(queryRunner, Croqui, croquisJson);
    await insertDataWithFKResolution(queryRunner, Via, viasJson);
    
    await insertDataWithFKResolution(queryRunner, Usuario, usuariosJson);
    await associateViaCroqui(queryRunner);
    await associateLocalizacoes(queryRunner);
    
    // Corrigir sequências após inserir dados
    await fixSequences(queryRunner);

    // Se chegou até aqui, tudo deu certo - commit de tudo
    await queryRunner.commitTransaction();
    console.log("\n✅ Todos os dados foram carregados com sucesso!");
  } catch (error) {
    // Se der erro em qualquer ponto, faz rollback de tudo
    console.error("\n❌ Erro ao carregar dados. Fazendo rollback de todas as alterações...", error);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

/**
 * Insere dados SEM foreign keys (ex: Continente, Fonte, Imagem)
 * Armazena os IDs gerados no cache para uso posterior
 */
async function insertDataSimple<T>(
    queryRunner: QueryRunner,
    entityClass: ObjectType<T>,
    data: any[]
): Promise<void> {
  if (data.length === 0) {
    console.log(`⚠️  ${entityClass.name} está vazio, pulando inserção.`);
    return;
  }

  const metadata = queryRunner.manager.connection.getMetadata(entityClass);
  const tableName = metadata.tableName;
  idCache[tableName] = {};
  
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const columns: string[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];
    let paramIndex = 1;
    
    // Processar apenas colunas simples (não-FK)
    for (const column of metadata.columns) {
      const propName = column.propertyName;
      const value = item[propName];
      
      // Ignorar campos de relacionamento e arrays
      if (value !== undefined && !Array.isArray(value) && typeof value !== 'object') {
        columns.push(`"${column.databaseName}"`);
        values.push(value);
        placeholders.push(`$${paramIndex}`);
        paramIndex++;
      }
    }
    
    if (columns.length > 0) {
      const sql = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING id`;
      const result = await queryRunner.query(sql, values);
      
      // Armazenar o ID gerado: índice no JSON (1-based) -> ID real no banco
      if (result[0] && result[0].id) {
        idCache[tableName][index + 1] = result[0].id;
      }
    }
  }
  
  console.log(`✅ ${entityClass.name} inserido com sucesso (${data.length} registros)`);
}

/**
 * Insere dados COM foreign keys, resolvendo-as via cache de IDs
 */
async function insertDataWithFKResolution<T>(
    queryRunner: QueryRunner,
    entityClass: ObjectType<T>,
    data: any[]
): Promise<void> {
  if (data.length === 0) {
    console.log(`⚠️  ${entityClass.name} está vazio, pulando inserção.`);
    return;
  }

  const metadata = queryRunner.manager.connection.getMetadata(entityClass);
  const tableName = metadata.tableName;
  idCache[tableName] = {};
  
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
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
        // É uma FK detectada via metadados - precisa resolver usando o cache
        const jsonFieldName = relation.propertyName;
        const fkValue = item[jsonFieldName];
        
        if (fkValue !== undefined && fkValue !== null) {
          const relatedTableName = relation.inverseEntityMetadata.tableName;
          
          // Se for número, é uma referência ao índice no JSON
          if (typeof fkValue === 'number') {
            // Tentar buscar no cache primeiro
            if (idCache[relatedTableName] && idCache[relatedTableName][fkValue]) {
              value = idCache[relatedTableName][fkValue];
            } else {
              // Se não estiver no cache, assumir que é um ID direto (para dados pré-existentes)
              value = fkValue;
            }
          } else if (typeof fkValue === 'object' && fkValue.id) {
            value = fkValue.id;
          }
        } else {
          value = null;
        }
      } else if (columnName.endsWith('Id') && !columnName.startsWith('via_')) {
        // FK "manual" detectada pelo sufixo "Id" (ex: montanhaId, faceId, fonteId)
        // Extrair o nome da propriedade do JSON (ex: "montanhaId" -> "montanha")
        const propName = column.propertyName;
        const jsonFieldName = propName.replace(/Id$/, ''); // Remove "Id" do final
        value = item[jsonFieldName];
        
        if (typeof value === 'number') {
          // Tentar resolver via cache
          const relatedTableName = jsonFieldName.toLowerCase();
          if (idCache[relatedTableName] && idCache[relatedTableName][value]) {
            value = idCache[relatedTableName][value];
          }
          // Se não encontrar no cache, usar o valor original
        }
      } else {
        // Coluna normal
        const propName = column.propertyName;
        value = item[propName];
        
        // Se a coluna termina com _id e tem um valor numérico, pode ser uma FK "manual"
        // Tentar resolver via cache
        if (columnName.endsWith('_id') && typeof value === 'number') {
          // Extrair o nome da tabela relacionada (ex: "fonte_id" -> "fonte")
          const relatedTableName = columnName.replace('_id', '');
          if (idCache[relatedTableName] && idCache[relatedTableName][value]) {
            value = idCache[relatedTableName][value];
          }
          // Se não encontrar no cache, usar o valor original
        }
        
        // Ignorar objetos complexos e arrays
        if (value !== undefined && typeof value === 'object' && !Array.isArray(value)) {
          value = undefined;
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
      const sql = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING id`;
      const result = await queryRunner.query(sql, values);
      
      // Armazenar o ID gerado no cache
      if (result[0] && result[0].id) {
        idCache[tableName][index + 1] = result[0].id;
      }
    }
  }
  
  console.log(`✅ ${entityClass.name} inserido com sucesso (${data.length} registros)`);
}


async function associateViaCroqui(queryRunner: QueryRunner) {
  // Não inicia nova transação - usa a transação global
  console.log("Associando Via-Croqui...");
  
  for (const viaCroquiData of viasCroquisJson) {
    try {
      // Resolver IDs via cache
      const realViaId = idCache['via'] && idCache['via'][viaCroquiData.via_id]
        ? idCache['via'][viaCroquiData.via_id]
        : viaCroquiData.via_id;
      
      const realCroquiId = idCache['croqui'] && idCache['croqui'][viaCroquiData.croqui_id]
        ? idCache['croqui'][viaCroquiData.croqui_id]
        : viaCroquiData.croqui_id;
      
      // Verificar se via e croqui existem
      const viaExists = await queryRunner.manager.query(
        'SELECT 1 FROM via WHERE id = $1',
        [realViaId]
      );
      
      const croquiExists = await queryRunner.manager.query(
        'SELECT 1 FROM croqui WHERE id = $1',
        [realCroquiId]
      );
      
      if (viaExists.length === 0) {
        console.warn(`⚠️ Via ${viaCroquiData.via_id} (ID real: ${realViaId}) não encontrada`);
        continue;
      }
      
      if (croquiExists.length === 0) {
        console.warn(`⚠️ Croqui ${viaCroquiData.croqui_id} (ID real: ${realCroquiId}) não encontrado`);
        continue;
      }
      
      // Inserir associação
      await queryRunner.manager.query(
        'INSERT INTO via_croqui (via_id, croqui_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [realViaId, realCroquiId]
      );
    } catch (error) {
      console.error(`❌ Erro ao associar via ${viaCroquiData.via_id} com croqui ${viaCroquiData.croqui_id}:`, error);
      throw error;
    }
  }
  
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
        // Buscar o ID da montanha pelo nome (já que não temos ID no JSON)
        const montanhaResult = await queryRunner.manager.query(
          'SELECT id FROM montanha WHERE nome = $1',
          [montanhaData.nome]
        );
        
        if (montanhaResult.length === 0) {
          console.warn(`⚠️ Montanha "${montanhaData.nome}" não encontrada no banco`);
          continue;
        }
        
        const montanhaId = montanhaResult[0].id;
        const localizacaoIds = montanhaData.localizacoes;
        
        for (const locId of localizacaoIds) {
          // Resolver o ID da localização via cache (índice no JSON -> ID real)
          const realLocId = idCache['localizacao'] && idCache['localizacao'][locId] 
            ? idCache['localizacao'][locId] 
            : locId;
          
          const locExists = await queryRunner.manager.query(
            'SELECT 1 FROM localizacao WHERE id = $1',
            [realLocId]
          );
          
          if (locExists.length === 0) {
            console.warn(`⚠️ Localização ${locId} (ID real: ${realLocId}) não encontrada para montanha ${montanhaData.nome}`);
            continue;
          }
          
          await queryRunner.manager.query(
            `INSERT INTO montanha_localizacoes ("${montanhaCols.entityCol}", "${montanhaCols.relatedCol}") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [montanhaId, realLocId]
          );
        }
      } catch (error) {
        console.error(`❌ Erro ao associar localizações à montanha "${montanhaData.nome}":`, error);
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
        // Resolver o ID da montanha via cache
        const realMontanhaId = idCache['montanha'] && idCache['montanha'][faceData.montanha]
          ? idCache['montanha'][faceData.montanha]
          : faceData.montanha;
        
        // Buscar o ID da face pelo nome e montanha (já que não temos ID no JSON)
        const faceResult = await queryRunner.manager.query(
          'SELECT id FROM face WHERE nome = $1 AND "montanhaId" = $2',
          [faceData.nome, realMontanhaId]
        );
        
        if (faceResult.length === 0) {
          console.warn(`⚠️ Face "${faceData.nome}" (montanha ${faceData.montanha} -> ID real: ${realMontanhaId}) não encontrada no banco`);
          continue;
        }
        
        const faceId = faceResult[0].id;
        const localizacaoIds = faceData.localizacoes;
        
        for (const locId of localizacaoIds) {
          // Resolver o ID da localização via cache
          const realLocId = idCache['localizacao'] && idCache['localizacao'][locId]
            ? idCache['localizacao'][locId]
            : locId;
          
          const locExists = await queryRunner.manager.query(
            'SELECT 1 FROM localizacao WHERE id = $1',
            [realLocId]
          );
          
          if (locExists.length === 0) {
            console.warn(`⚠️ Localização ${locId} (ID real: ${realLocId}) não encontrada para face "${faceData.nome}"`);
            continue;
          }
          
          await queryRunner.manager.query(
            `INSERT INTO face_localizacoes ("${faceCols.entityCol}", "${faceCols.relatedCol}") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [faceId, realLocId]
          );
        }
      } catch (error) {
        console.error(`❌ Erro ao associar localizações à face "${faceData.nome}":`, error);
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
        // Resolver o ID da face via cache
        const realFaceId = idCache['face'] && idCache['face'][setorData.face]
          ? idCache['face'][setorData.face]
          : setorData.face;
        
        // Buscar o ID do setor pelo nome e face (já que não temos ID no JSON)
        const setorResult = await queryRunner.manager.query(
          'SELECT id FROM setor WHERE nome = $1 AND "faceId" = $2',
          [setorData.nome, realFaceId]
        );
        
        if (setorResult.length === 0) {
          console.warn(`⚠️ Setor "${setorData.nome}" (face ${setorData.face} -> ID real: ${realFaceId}) não encontrado no banco`);
          continue;
        }
        
        const setorId = setorResult[0].id;
        const localizacaoIds = setorData.localizacoes;
        
        for (const locId of localizacaoIds) {
          // Resolver o ID da localização via cache
          const realLocId = idCache['localizacao'] && idCache['localizacao'][locId]
            ? idCache['localizacao'][locId]
            : locId;
          
          const locExists = await queryRunner.manager.query(
            'SELECT 1 FROM localizacao WHERE id = $1',
            [realLocId]
          );
          
          if (locExists.length === 0) {
            console.warn(`⚠️ Localização ${locId} (ID real: ${realLocId}) não encontrada para setor "${setorData.nome}"`);
            continue;
          }
          
          await queryRunner.manager.query(
            `INSERT INTO setor_localizacoes ("${setorCols.entityCol}", "${setorCols.relatedCol}") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [setorId, realLocId]
          );
        }
      } catch (error) {
        console.error(`❌ Erro ao associar localizações ao setor "${setorData.nome}":`, error);
        throw error;
      }
    }
  }

  console.log("✅ Localizações associadas com sucesso.");
}

async function fixSequences(queryRunner: QueryRunner) {
  console.log("🔧 Corrigindo sequências do banco de dados...");
  
  // Lista de tabelas que têm sequências (tabelas com ID auto-incremento)
  const tables = [
    'continente', 'pais', 'regiao', 'estado', 'cidade', 'bairro', 'localizacao',
    'fonte', 'imagem', 'montanha', 'face', 'setor', 'croqui', 'via', 'usuario',
    'colecao', 'escalada', 'participante', 'via_croqui'
  ];
  
  for (const table of tables) {
    try {
      // Verificar se a tabela existe e tem registros
      const result = await queryRunner.query(`SELECT MAX(id) as max_id FROM "${table}"`);
      const maxId = result[0]?.max_id;
      
      if (maxId) {
        // Ajustar a sequência para o próximo valor após o MAX
        await queryRunner.query(`SELECT setval('${table}_id_seq', ${maxId})`);
        console.log(`  ✅ Sequência ${table}_id_seq ajustada para ${maxId}`);
      }
    } catch (error) {
      // Ignorar erros (tabela pode não existir ou não ter sequência)
      console.log(`  ⚠️ Não foi possível ajustar sequência para ${table}`);
    }
  }
  
  console.log("✅ Sequências corrigidas com sucesso!");
}
