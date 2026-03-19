import { AppDataSource } from '../../config/db';
import { Via } from '../../../Domain/entities/Via';
import { ViaImagem } from '../../../Domain/entities/ViaImagem';
import { Montanha } from '../../../Domain/entities/Montanha';
import { Face } from '../../../Domain/entities/Face';
import { ReferenciasIds } from './ReferenciasLoader';
import { loadYaml } from '../seedUtils';

const VIA_IMAGEM_DEFAULT = '/assets/vias/via-default-01.webp';

/**
 * Campos simples da Via que são atualizados no upsert quando presentes no YAML.
 * Para adicionar um novo campo atualizável: basta incluí-lo aqui e na interface ViaYaml.
 */
const UPSERT_FIELDS = ['grau', 'crux', 'artificial', 'exposicao', 'via_cerj', 'historia_resumo', 'equipamentos', 'tracklog_aproximacao'] as const;
type UpsertField = (typeof UPSERT_FIELDS)[number];

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
  imagem?: string;
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
      const imgId = v.imagem ? refs.imagens.get(v.imagem) : imagemId;
      if (imgId) {
        const vi = viaImagemRepo.create({ via: ent, imagem: { id: imgId } as any });
        await viaImagemRepo.save(vi);
      }
    } else {
      for (const field of UPSERT_FIELDS) {
        (ent as unknown as Record<string, unknown>)[field] = v[field] ?? null;
      }
      await repo.save(ent);
      if (v.imagem) {
        const imgId = refs.imagens.get(v.imagem);
        if (imgId) {
          const existing = await viaImagemRepo.findOne({ where: { via: { id: ent.id } } });
          if (existing) {
            existing.imagem = { id: imgId } as any;
            await viaImagemRepo.save(existing);
          } else {
            const vi = viaImagemRepo.create({ via: ent, imagem: { id: imgId } as any });
            await viaImagemRepo.save(vi);
          }
        }
      }
    }
    ids.set(v.nome, ent.id);
  }

  console.log(`[ViaLoader] ${ids.size} vias`);
  return ids;
}
