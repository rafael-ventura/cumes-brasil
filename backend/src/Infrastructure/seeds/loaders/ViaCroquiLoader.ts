import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { ViaCroqui } from '../../../Domain/entities/ViaCroqui';

function loadYaml<T>(file: string): T {
  const p = path.join(process.cwd(), 'src', 'Infrastructure', 'data', file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return yaml.load(fs.readFileSync(p, 'utf-8')) as T;
}

interface ViaCroquiYaml {
  via: string;
  croqui: string;
  croqui_imagem?: string;
}

export async function runViaCroquiLoader(
  viaIds: Map<string, number>,
  croquiIds: Map<string, number>
): Promise<void> {
  const repo = AppDataSource.getRepository(ViaCroqui);
  const data = loadYaml<ViaCroquiYaml[]>('via_croquis.yaml');

  for (const vc of data) {
    const viaId = viaIds.get(vc.via);
    if (!viaId) continue;
    const croquiKey = vc.croqui_imagem ? `${vc.croqui}|${vc.croqui_imagem}` : vc.croqui;
    const croquiId = croquiIds.get(croquiKey) ?? Array.from(croquiIds.entries()).find(([k]) => k.startsWith(vc.croqui + '|'))?.[1];
    if (!croquiId) continue;

    const exists = await repo
      .createQueryBuilder('vc')
      .where('vc.via_id = :viaId', { viaId })
      .andWhere('vc.croqui_id = :croquiId', { croquiId })
      .getOne();
    if (!exists) {
      const ent = repo.create({ via: { id: viaId } as any, croqui: { id: croquiId } as any });
      await repo.save(ent);
    }
  }

  console.log('ViaCroquiLoader: OK');
}
