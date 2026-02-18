import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { Face } from '../../../Domain/entities/Face';
import { Localizacao } from '../../../Domain/entities/Localizacao';
import { ReferenciasIds } from './ReferenciasLoader';

function loadYaml<T>(file: string): T {
  const p = path.join(process.cwd(), 'src', 'Infrastructure', 'data', file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return yaml.load(fs.readFileSync(p, 'utf-8')) as T;
}

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
      const locIds = f.localizacoes
        .map((b) => Array.from(refs.localizacoes.entries()).find(([k]) => k.endsWith(`|${b}`))?.[1])
        .filter((id): id is number => id != null);
      if (locIds.length) {
        const face = await repo.findOne({ where: { id: ent.id }, relations: ['localizacoes'] });
        if (face) {
          face.localizacoes = locIds.map((id) => ({ id } as Localizacao));
          await repo.save(face);
        }
      }
    }
  }

  console.log(`FacesLoader: ${ids.size} faces`);
  return ids;
}
