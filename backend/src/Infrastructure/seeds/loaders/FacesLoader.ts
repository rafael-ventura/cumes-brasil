import { AppDataSource } from '../../config/db';
import { Face } from '../../../Domain/entities/Face';
import { Localizacao } from '../../../Domain/entities/Localizacao';
import { ReferenciasIds } from './ReferenciasLoader';
import { loadYaml, resolveLocalizacaoIds } from '../seedUtils';

interface FaceYaml {
  nome: string;
  montanha: string;
  fonte: string;
  localizacoes?: string[];
}

export async function runFacesLoader(
  refs: ReferenciasIds,
  montanhaIds: Map<string, number>
): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  const repo = AppDataSource.getRepository(Face);
  const data = loadYaml<FaceYaml[]>('faces.yaml');

  for (const f of data) {
    const montanhaId = montanhaIds.get(f.montanha);
    if (!montanhaId) throw new Error(`Montanha não encontrada: ${f.montanha}`);
    const fonteId = refs.fonteByAutor.get(f.fonte);
    if (!fonteId) throw new Error(`Fonte não encontrada: ${f.fonte}`);

    let ent = await repo.findOne({ where: { nome: f.nome, montanha: montanhaId } });
    if (!ent) {
      ent = repo.create({ nome: f.nome, montanha: montanhaId, fonte: fonteId });
      await repo.save(ent);
    }
    ids.set(`${f.montanha}|${f.nome}`, ent.id);

    if (f.localizacoes?.length) {
      const locIds = resolveLocalizacaoIds(f.localizacoes, refs.localizacoes);
      if (locIds.length) {
        const face = await repo.findOne({ where: { id: ent.id }, relations: ['localizacoes'] });
        if (face) {
          face.localizacoes = locIds.map((id) => ({ id } as Localizacao));
          await repo.save(face);
        }
      }
    }
  }

  console.log(`[FacesLoader] ${ids.size} faces`);
  return ids;
}
