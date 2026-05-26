import { AppDataSource } from '../../config/db';
import { Colecao } from '../../../Domain/entities/Colecao';
import { ViaColecao } from '../../../Domain/entities/ViaColecao';
import { loadYaml } from '../seedUtils';

interface ColecoesYaml {
  favoritos: Record<string, string[]>;
  colecoes: Array<{
    username: string;
    nome: string;
    descricao?: string;
    vias: string[];
  }>;
}

async function garantirViaColecao(
  repo: ReturnType<typeof AppDataSource.getRepository<ViaColecao>>,
  colecaoId: number,
  viaId: number
): Promise<void> {
  const existente = await repo.findOne({
    where: { colecao: { id: colecaoId }, via: { id: viaId } }
  });
  if (existente) return;
  await repo.save(
    repo.create({
      colecao: { id: colecaoId } as any,
      via: { id: viaId } as any
    })
  );
}

/**
 * Popula `via_colecao` para Favoritas e coleções personalizadas (colecoes-vias-teste.yaml).
 * Idempotente: não duplica par colecão+via.
 */
export async function runColecaoConteudoLoader(
  usuarioPorUsername: Map<string, number>,
  viaIds: Map<string, number>
): Promise<void> {
  const yaml = loadYaml<ColecoesYaml>('colecoes-vias-teste.yaml');
  if (!yaml) return;

  const colecaoRepo = AppDataSource.getRepository(Colecao);
  const viaColecaoRepo = AppDataSource.getRepository(ViaColecao);

  if (yaml.favoritos) {
    for (const [username, vias] of Object.entries(yaml.favoritos)) {
      const uid = usuarioPorUsername.get(username);
      if (!uid) {
        console.warn(`[ColecaoConteudoLoader] Usuário desconhecido em favoritos: ${username}`);
        continue;
      }
      const favoritas = await colecaoRepo.findOne({
        where: { usuario: { id: uid }, nome: 'Favoritas' }
      });
      if (!favoritas) {
        console.warn(`[ColecaoConteudoLoader] Coleção Favoritas não encontrada para user id ${uid}`);
        continue;
      }
      for (const nomeVia of vias) {
        const viaId = viaIds.get(nomeVia);
        if (!viaId) {
          console.warn(`[ColecaoConteudoLoader] Via desconhecida: ${nomeVia}`);
          continue;
        }
        await garantirViaColecao(viaColecaoRepo, favoritas.id, viaId);
      }
    }
  }

  if (yaml.colecoes?.length) {
    for (const c of yaml.colecoes) {
      const uid = usuarioPorUsername.get(c.username);
      if (!uid) {
        console.warn(`[ColecaoConteudoLoader] Usuário desconhecido: ${c.username}`);
        continue;
      }
      let colecao = await colecaoRepo.findOne({
        where: { usuario: { id: uid }, nome: c.nome }
      });
      if (!colecao) {
        colecao = colecaoRepo.create({
          nome: c.nome,
          descricao: c.descricao || '',
          usuario: { id: uid } as any
        });
        await colecaoRepo.save(colecao);
        console.log(`[ColecaoConteudoLoader] Coleção criada: "${c.nome}" (${c.username})`);
      }
      for (const nomeVia of c.vias || []) {
        const viaId = viaIds.get(nomeVia);
        if (!viaId) {
          console.warn(`[ColecaoConteudoLoader] Via desconhecida: ${nomeVia}`);
          continue;
        }
        await garantirViaColecao(viaColecaoRepo, colecao.id, viaId);
      }
    }
  }

  console.log('[ColecaoConteudoLoader] Vínculos via–coleção garantidos (idempotente).');
}
