import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { Via } from '../../../Domain/entities/Via';
import { ViaImagem } from '../../../Domain/entities/ViaImagem';
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
  historia_resumo?: string;
  via_cerj?: boolean;
  equipamentos?: string;
  tracklog_aproximacao?: string;
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
  const viaImagemRepo = AppDataSource.getRepository(ViaImagem);
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
        historia_resumo: v.historia_resumo,
        via_cerj: v.via_cerj ?? false,
        equipamentos: v.equipamentos,
        tracklog_aproximacao: v.tracklog_aproximacao,
        data: v.data,
        montanha: { id: montanhaId } as Montanha,
        face: { id: faceId } as Face,
        fonte: fonteId,
        viaPrincipal: viaPrincipalId
      });
      await repo.save(ent);
      if (imagemId) {
        const vi = viaImagemRepo.create({ via: ent, imagem: { id: imagemId } as any });
        await viaImagemRepo.save(vi);
      }
    } else if (v.via_cerj !== undefined || v.historia_resumo !== undefined || v.equipamentos !== undefined || v.tracklog_aproximacao !== undefined) {
      if (v.via_cerj !== undefined) ent.via_cerj = v.via_cerj;
      if (v.historia_resumo !== undefined) ent.historia_resumo = v.historia_resumo;
      if (v.equipamentos !== undefined) ent.equipamentos = v.equipamentos;
      if (v.tracklog_aproximacao !== undefined) ent.tracklog_aproximacao = v.tracklog_aproximacao;
      await repo.save(ent);
    }
    ids.set(v.nome, ent.id);
  }

  console.log(`ViaLoader: ${ids.size} vias`);
  return ids;
}
