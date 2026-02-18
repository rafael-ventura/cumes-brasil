import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { Via } from '../../../Domain/entities/Via';
import { Montanha } from '../../../Domain/entities/Montanha';
import { Face } from '../../../Domain/entities/Face';
import { ReferenciasIds } from './ReferenciasLoader';

const VIA_IMAGEM_DEFAULT = '/assets/via-default-01.webp';

function loadYaml<T>(file: string): T {
  const p = path.join(process.cwd(), 'src', 'Infrastructure', 'data', file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return yaml.load(fs.readFileSync(p, 'utf-8')) as T;
}

interface ViaYaml {
  nome: string;
  grau?: string;
  crux?: string;
  artificial?: string;
  duracao?: string;
  exposicao?: string;
  extensao?: number;
  conquistadores?: string;
  detalhes?: string;
  data?: string;
  montanha: string;
  face: string;
  fonte: string;
  viaPrincipal?: string;
}

export async function runViaLoader(
  refs: ReferenciasIds,
  montanhaIds: Map<string, number>,
  faceIds: Map<string, number>
): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  const repo = AppDataSource.getRepository(Via);
  const data = loadYaml<ViaYaml[]>('vias.yaml');
  const imagemId = refs.imagens.get(VIA_IMAGEM_DEFAULT);

  for (const v of data) {
    const montanhaId = montanhaIds.get(v.montanha);
    if (!montanhaId) throw new Error(`Montanha não encontrada: ${v.montanha}`);
    const faceId = faceIds.get(`${v.montanha}|${v.face}`);
    if (!faceId) throw new Error(`Face não encontrada: ${v.montanha}|${v.face}`);
    const fonteId = refs.fonteByAutor.get(v.fonte);
    if (!fonteId) throw new Error(`Fonte não encontrada: ${v.fonte}`);

    let ent = await repo.findOne({
      where: { nome: v.nome, montanha: { id: montanhaId }, face: { id: faceId } }
    });
    if (!ent) {
      const viaPrincipalId = v.viaPrincipal ? ids.get(v.viaPrincipal) : undefined;
      ent = repo.create({
        nome: v.nome,
        grau: v.grau,
        crux: v.crux,
        artificial: v.artificial,
        duracao: v.duracao,
        exposicao: v.exposicao,
        extensao: v.extensao,
        conquistadores: v.conquistadores,
        detalhes: v.detalhes,
        data: v.data,
        montanha: { id: montanhaId } as Montanha,
        face: { id: faceId } as Face,
        fonte: fonteId,
        imagem: imagemId,
        viaPrincipal: viaPrincipalId
      });
      await repo.save(ent);
    }
    ids.set(v.nome, ent.id);
  }

  console.log(`ViaLoader: ${ids.size} vias`);
  return ids;
}
